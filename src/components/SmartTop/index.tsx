import { useState, useRef, useImperativeHandle } from 'react';
import SmartForm from '../SmartForm';

const SmartTop: any = (props: any) => {
  const [formLayout, setFormLayout] = useState('inline');
  const [cols, setCols] = useState(null);
  
  if (props.formLayout)
    setFormLayout(props.formLayout);

  if (props.cols)
    setCols(props.cols);

  const formRef = useRef(null);

  const refForm = (e) => {
    formRef.current = e;
  }

  // 暴露组件的方法
  useImperativeHandle(props.onRef, () => ({
    getForm: (params) => {
      return formRef.current.getForm();
    }
  }));

  const handleSubmit = () => {
    props.handleSubmit(formRef.current.getForm().getFieldsValue());
  }

  return (
    <div>
      <SmartForm
        formLayout={formLayout}
        ref={(e) => refForm(e)}
        onSubmit={handleSubmit}
        cols={cols}
        fields={props.getFields ? props.getFields() : props.fields}
        submitName={props?.submitName ?? '查询'}
      >
        {props.children}
      </SmartForm>
    </div >
  );
};

export default SmartTop;