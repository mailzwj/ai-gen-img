import { useState, useMemo } from 'react';
import { Input, InputNumber, Button, message, Form, Modal } from 'antd';
import axios from 'axios';
import classnames from 'classnames';
import { API_BASE_URL, IMG_GEN_API_PATH } from '@/constant';
import styles from './index.less';

export default function HomePage() {

  const [formRef] = Form.useForm();

  const [running, setRunning] = useState<boolean>(false);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');

  const lableCol = useMemo(() => ({ span: 4 }), []);

  const handleFinish = async (values: any) => {
    formRef.validateFields().then(async () => {
      const { token, ...data } = values;
      setRunning(true);
      setModelOpen(true);
      const res = await axios({
        method: 'post',
        url: `${API_BASE_URL}${IMG_GEN_API_PATH}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-ModelScope-Async-Mode': 'true',
        },
        data,
      });
      // console.log('>>> res', res);
      setRunning(false);
      const { status, data: resData } = res;
      if (status !== 200) {
        message.error('图片生成失败，请检查令牌和模型ID是否正确');
        setModelOpen(false);
        setResult('');
        return;
      }
      setResult(resData?.images?.[0]?.url);
    }).catch(() => {
      message.error('请检查表单填写是否正确');
      return;
    });
  };

  return (
    <>
      <Form
        form={formRef}
        className={styles.cont}
        initialValues={{
          model: 'ONETranquil/F.1-dev-fp8',
          prompt: 'A beautiful landscape with mountains and a river',
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          className={styles.formItem}
          name="token"
          label="令牌"
          help="请在 https://modelscope.cn/ 上注册账号获取令牌"
          labelAlign='right'
          labelCol={lableCol}
          required
          rules={[{ required: true, message: 'ModelScope 令牌不能为空' }]}
        >
          <Input.Password
            placeholder="请输入您的 ModelScope 令牌"
            allowClear
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="model"
          label="模型ID"
          help="ModelScope上的 AIGC 模型ID"
          labelAlign='right'
          labelCol={lableCol}
          required
          rules={[{ required: true, message: '模型ID不能为空' }]}
        >
          <Input
            placeholder="ModelScope 上的 AIGC 模型ID"
            allowClear
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="prompt"
          label="正向提示词"
          help="控制图片生成的提示词，建议使用英文，长度小于2000"
          labelAlign='right'
          labelCol={lableCol}
          required
          rules={[{ required: true, message: '正向提示词不能为空' }]}
        >
          <Input.TextArea
            placeholder="请填写提示词"
            allowClear
            rows={4}
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="negative_prompt"
          label="负向提示词"
          help="控制图片生成的提示词，建议使用英文，长度小于2000"
          labelAlign='right'
          labelCol={lableCol}
        >
          <Input.TextArea
            placeholder="请填写提示词"
            allowClear
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="size"
          label="分辨率"
          help="SD系列：[64x64,2048x2048]，FLUX：[64x64,1024x1024]，默认760x1280"
          labelAlign='right'
          labelCol={lableCol}
        >
          <Input
            placeholder="请输入生成图像的分辨率，如：1024x768"
            allowClear
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="steps"
          label="采样步数"
          help="[1, 100]，默认30，建议不少于20"
          labelAlign='right'
          labelCol={lableCol}
        >
          <InputNumber
            placeholder="请输入采样步数"
            min={1}
            max={100}
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name="guidance"
          label="引导系数"
          help="[1.5, 20]，默认3.5"
          labelAlign='right'
          labelCol={lableCol}
        >
          <InputNumber
            placeholder="请输入引导系数"
            min={1.5}
            max={20}
            step={0.1}
          />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          name=""
          label=" "
          labelCol={lableCol}
          colon={false}
        >
          <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={running}>生成图片</Button>
        </Form.Item>
      </Form>
      <Modal
        title="生成结果"
        open={modelOpen}
        onCancel={() => setModelOpen(false)}
        footer={null}
        width="70%"
      >
        {result ? (
          <div className={styles.resultPreview}>
            <img src={result} alt="Result image" className={styles.resultImage} />
            <div className={styles.attention}>本工具不会自动保存任何数据，如生成结果满意，请自行保存“图片上右键-图片另存为”</div>
          </div>
        ) : (
          <div className={classnames({
            [styles.resultPreview]: true,
            [styles.noResult]: true
          })}>
            图片生成中，请耐心等待，请勿关闭页面
          </div>
        )}
      </Modal>
    </>
  );
}
