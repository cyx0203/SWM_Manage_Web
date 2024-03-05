import React,{Fragment} from "react";
import {Col, Form} from "antd";
import FormItem from "./Item";


export type FormColProps = {
  item: any;
  layout: any;
  cols: any;
  formItemLayout: any;
  addFormFields: any;
  subFormFields: any;
};

const FormCol: React.FC<FormColProps> = (props) => {
  
  const {
    item,
    layout,
    cols,
    formItemLayout,
    addFormFields,
    subFormFields,
  } = props;


  if(layout === "inline"){
    if(item.type === 'rate'){
      item.style = {fontSize:'14px'};//默认
    }
    if(cols){
      return(
        <Col span={24/cols*(item.colSpan||1)} offset={24/cols*(item.offsetColSpan||0)}>
          {item.type !== 'fragment' && <FormItem item={item} layout={layout} formItemLayout={formItemLayout} addFormFields={addFormFields} subFormFields={subFormFields}></FormItem>}
          {item.type === 'fragment' && <Form.Item><div style={{lineHeight:'40px',height:'40px'}} /></Form.Item>}
        </Col>
      );
    }
    return ( 
      <Fragment>
        {item.type !== 'fragment' && <FormItem item={item} layout={layout} cols={cols}  addFormFields={addFormFields} subFormFields={subFormFields}/>}
        {item.type === 'fragment' && 
        <Form.Item><div style={{lineHeight:'40px',height:'40px'}} /></Form.Item> 
        }
      </Fragment>
    );
  }
  return(
    <Col span={24}>
      {item && item.type !=='fragment' && <FormItem item={item} layout={layout}  addFormFields={addFormFields} subFormFields={subFormFields}/>}
    </Col>
  );
};
export default FormCol;