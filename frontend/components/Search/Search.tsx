import { Select, message } from "antd";
import { Fragment, useState, useEffect } from "react";
import styles from "./Search.module.css";
import { addHistory } from "../../appRedux/search";
import { connect, ConnectedProps } from "react-redux";
import { BehaviorSubject, of, merge } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
  switchMap,
  catchError,
} from "rxjs/operators";

const { Option } = Select;

interface State {
  data: string[];
  errorMessage: string;
  value: any;
}

/**
 *
 * @param props
 * @returns JSX search component
 * @description search bar component
 */
const Search = (props: Props) => {
  const [subject, setSubject] = useState<BehaviorSubject<string>>();
  const [state, setState] = useState<State>({
    data: [],
    errorMessage: "",
    value: null,
  });

  /**
   * @description this part protects the API by avoiding sending unnecessary search request
   */
  useEffect(() => {
    if (subject === undefined) {
      const sub = new BehaviorSubject("");
      setSubject(sub);
    } else {
      const observable = subject!
        .pipe(
          map((s) => s.trim()),
          distinctUntilChanged(),
          filter((s) => s.length >= 2),
          debounceTime(200),
          switchMap((term) =>
            merge(
              of({ errorMessage: "" }),
              fetch(
                `http://${process.env.NEXT_PUBLIC_API}/search?term=${term}`
              ).then((response: Record<string, any>) => {
                if (response.ok) {
                  return response.json().then((data: Record<string, any>) => ({
                    data: data.data.body.results,
                  }));
                }
                return response.json().then((data: Record<string, any>) => ({
                  data: [],
                  errorMessage: data.title,
                }));
              })
            )
          ),
          catchError(async (e) => ({
            errorMessage: "Network error.",
          }))
        )
        .subscribe((newState: Record<string, any>) => {
          if (newState.errorMessage) message.error(newState.errorMessage);
          setState((state) => ({ ...state, ...newState }));
        });

      return () => {
        observable.unsubscribe();
        subject?.unsubscribe();
      };
    }
  }, [subject]);

  /**
   *
   * @param value search term
   * @description send request to the search API
   */
  const handleSearch = async (value: string) => {
    if (value.length < 2) setState((state) => ({ ...state, data: [] }));
    if (subject) {
      return subject.next(value);
    }
  };

  /* add one line to the search history */
  const onSelect = (value: string) => {
    setState((state) => ({ ...state, data: [], value: null }));
    props.addHistory(value);
  };

  return (
    <Fragment>
      <Select
        showSearch
        allowClear
        placeholder="Search for company name here"
        className={styles.search}
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={onSelect}
        notFoundContent={null}
        value={state.value}
      >
        {state.data.map((item: string) => (
          <Option key={Math.random().toString()} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    </Fragment>
  );
};

/* connect this component to redux for adding new line to the history */
const connector = connect(null, { addHistory });
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};

export default connector(Search);
