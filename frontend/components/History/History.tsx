import { Button } from "antd";
import styles from "./History.module.css";
import { CloseOutlined } from "@ant-design/icons";
import { connect, ConnectedProps } from "react-redux";
import { SearchInt, removeHistory, clearHistory } from "../../appRedux/search";

/**
 * 
 * @param props 
 * @returns JSX serach history component
 */
const History = (props: Props) => {
	/* delete one line from history */
  const deleteLine = (value: any) => {
    props.removeHistory({ data: value.data, timeStamp: value.timeStamp });
  };

  return (
    <div className={styles.history}>
      <div className={`${styles.container} text-bold`}>
        <div>Search history</div>
        <div className={styles.clear}>
          <u>
            <a onClick={props.clearHistory}>Clear search history</a>
          </u>
        </div>
      </div>
      <ul>
        {props.searchHistory.map((item) => (
          <li className={`${styles.history__item}`} key={item.timeStamp}>
            <div>{item.data}</div>
            <section className={styles.rs_history}>
              <div className={styles.timestamp}>{item.timeStamp}</div>
              <Button
                key="delete"
                className={styles.delete}
                shape="circle"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => deleteLine(item)}
              />
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* connect this component to redux to working with history */
const mapStateToProps = ({ search }: { search: SearchInt }) => {
  const { searchHistory } = search;
  return { searchHistory };
};
const connector = connect(mapStateToProps, { removeHistory, clearHistory });
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};

export default connector(History);
