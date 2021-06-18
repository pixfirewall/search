import { Layout } from "antd";
import Search from "../components/Search/Search";
import History from "../components/History/History";
import styles from "../styles/Home.module.css";

const { Header, Content, Footer } = Layout;

export default function Home() {
  return (
    <Layout>
      <Header>
        <p className={styles.header}>Company Search Engine</p>
      </Header>
      <Content className={styles.contents}>
        <div className={styles.container}>
          <Search />
          <History />
        </div>
      </Content>
      <Footer className={styles.footer}>
        Created by Amir Hodaee{" "}
        <u>
          <a href="mailto:pixozeus@gmail.com">pixozeus@gmail.com</a>
        </u>
      </Footer>
    </Layout>
  );
}
