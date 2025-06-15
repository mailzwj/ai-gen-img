// import React from 'react';
import { Outlet } from 'umi';
import { Layout } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

export default function PageLayout() {
  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div className={classnames({
          [styles.contentBox]: true,
          [styles.headerMain]: true
        })}>
          智能图片生成器
        </div>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        <div className={classnames({
          [styles.contentBox]: true,
          [styles.contentMain]: true
        })}>
          <Outlet />
        </div>
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        <div className={classnames({
          [styles.contentBox]: true,
          [styles.footerMain]: true
        })}>
          Powered by Meet_AI 2025
        </div>
      </Layout.Footer>
    </Layout>
  );
}
