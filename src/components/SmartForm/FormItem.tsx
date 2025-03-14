import React from 'react';
import { Form, Input, InputNumber, Select, Rate, Switch, Slider, Radio, Checkbox, DatePicker, TimePicker, Tree, Upload, Button, TreeSelect, Cascader } from 'antd';
import { CloudUploadOutlined } from "@ant-design/icons";
import pinyin from 'pinyin';

export type FormItemProps = {
  item: any;
  layout: any;
  cols?: any;
  formItemLayout?: any;
};

const FormItem: React.FC<FormItemProps> = (props) => {
  const {
    item,
    layout,
    cols,
    formItemLayout,
  } = props;
  const RangePicker: any = DatePicker.RangePicker;
  const MonthPicker: any = DatePicker.MonthPicker;
  const style = (layout === 'vertical' || !cols) ? {marginBottom: '10px'} : { display: 'flex', flex: 1};
  const emptyValidator = (rule, values, callback) => {
    callback();
  }

  const getItem = (it) => {
    if (it.type === 'input') {
      return <Input {...it} key={it.field} placeholder={it.placeholder} style={it.style} onPressEnter={(e) => it.onPressEnter && it.onPressEnter(e.currentTarget.value)} disabled={it.disabled || false} onChange={(e) => it.onChange && it.onChange(e.target.value)} />;
    }
    if (it.type === 'number') {
      return <InputNumber {...it} key={it.field} precision={it.precision} placeholder={it.placeholder} min={it.min} max={it.max} style={{ width: '100%', ...it.style }} onChange={(value) => it.onChange && it.onChange(value)} disabled={it.disabled || false} />;
    }
    if (it.type === 'button') {
      return (it.buttonList && it.buttonList.map((button,index) => <Button key={index} {...button}>{button.buttonText}</Button>));
    }
    if (it.type === 'select') {
      const options = it.options;
      delete it.options;
      return <Select
        key={it.field}
        placeholder={it.placeholder}
        onChange={it.onChange && it.onChange}
        mode={it.mode}
        style={it.style}
        disabled={it.disabled || false}
        filterOption={(input, option) => {
          return (option?.children ?? '').toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
            || (option?.key ?? '').toLowerCase().includes(input.toLowerCase()) // 根据key搜索
            || pinyin((option?.children ?? '').toString().toLowerCase(), { style: pinyin.STYLE_NORMAL, segment: true, heteronym: true }).join('').indexOf(input.toLowerCase()) >= 0
        }
        }

        {...it}>
        {options ? options.map(d => (
          <Select.Option key={d.value} value={d.value} disabled={d.disabled}>{d.txt}</Select.Option>
        )) : ''}
      </Select>;
    }
    if (it.type === 'rate') {
      return <span>
        <Rate {...it} tooltips={it.tooltips} allowHalf={it.allowHalf} onChange={it.onChange} value={it.value || 0} />
        {(it.value && it.tooltips) ? <span className="ant-rate-text">{it.tooltips[it.value - 1]}</span> : ''}
      </span>
    }
    if (it.type === 'password') {
      return <Input.Password key={it.field} onChange={it.onChange} placeholder={it.placeholder} {...it}/>
    }
    if (it.type === 'confirmpassword') {
      return <Input.Password key={it.field} onChange={it.onChange} placeholder={it.placeholder} />
    }
    if (it.type === 'switch') {
      return <Switch {...it} key={it.field} checkedChildren={it.checkedChildren} unCheckedChildren={it.unCheckedChildren} onChange={it.onChange} style={it.style} />;
    }
    if (it.type === 'slider') {
      return <Slider {...it} key={it.field} marks={it.marks} style={it.style} />
    }
    if (it.type === 'radio') {
      return <Radio.Group onChange={it.onChange} >
        {it.options ? it.options.map(d => (
          <Radio key={d.value} style={d.style} value={d.value}>{d.text}</Radio>
        )) : ''}
      </Radio.Group>
    }
    if (it.type === 'radiobutton') {
      return <Radio.Group onChange={it.onChange} >
        {it.options ? it.options.map(d => (
          <Radio.Button key={d.value} style={d.style} value={d.value}>{d.text}</Radio.Button>
        )) : ''}
      </Radio.Group>
    }
    if (it.type === 'checkbox') {
      return <Checkbox.Group options={it.options} value={it.checkedList} onChange={it.onChange} />;
    }
    if (it.type === 'date-picker') {
      return <DatePicker key={it.field} style={it.style} {...it} />;
    }
    if (it.type === 'cascader') {
      return <Cascader options={it.options} placeholder={it.placeholder} />;
    }
    if (it.type === 'date-time-picker') {
      return <DatePicker key={it.field} showTime format="YYYY-MM-DD HH:mm:ss" style={it.style} {...it} />;
    }
    if (it.type === 'month-picker') {
      return <MonthPicker key={it.field} style={it.style} {...it} />;
    }
    if (it.type === 'range-picker') {
      return <RangePicker key={it.field} style={it.style} {...it} />;
    }
    if (it.type === 'range-time-picker') {
      return <TimePicker.RangePicker key={it.field} showTime format="HH:mm:ss" style={{ width: '100%', ...it.style }} {...it} />;
    }
    if (it.type === 'time-picker') {
      return <TimePicker key={it.field} style={it.style} {...it} />;
    }
    if (it.type === 'textarea') {
      return <Input.TextArea key={it.field} rows={it.rows || undefined} cols={it.cols || undefined} placeholder={it.placeholder} {...it} />;
    }
    if (it.type === 'tree') {
      return <Tree key={it.field} {...it} />;
    }
    if (it.type === 'treeselect') {
      return <TreeSelect key={it.field} {...it} />;
    }
    return <Input {...it}/>;
  }

  const refForm = Form.useFormInstance();
  if (refForm && item) {
    if (item.type === "upload") {
      return (
        <Form.Item
          name={item.label}
          label={item.label}
          extra={item.extra || undefined}
          labelAlign={item.labelAlign || 'right'}
          style={layout === 'vertical' ? null : style}
          valuePropName={item.valuePropName}
          getValueFromEvent={e => item.getValueFromEvent(e)}
          {...formItemLayout}
          required={item.required || false}
          rules={{ message: item.message || '请选择' }}
        >
          <Upload name={item.name || 'upload'} action={item.action} listType={item.listType || 'picture'} disabled={item.disabled} {...item}>
            <Button icon={<CloudUploadOutlined />}>
              {item.buttonText || '选择图片'}
            </Button>
          </Upload>
        </Form.Item>
      );
    }
    return (
      <Form.Item
        label={item.label}
        style={style}
        labelAlign={item.labelAlign || 'right'}
        {...formItemLayout}
        key={item.field}
        name={item.field}
        help={item.help}
        initialValue={item.initialValue || undefined}
        rules={[{ required: item.required || false, message: item.message || '请输入' },
        { validator: item.validator || emptyValidator }].concat(item.rules || [])}
      >
        {getItem(item)}
      </Form.Item>
    );
  } else {
    return <></>;
  }
};

export default FormItem;

