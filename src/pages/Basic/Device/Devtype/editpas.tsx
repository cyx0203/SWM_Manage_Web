import { Ajax } from '@/components/PageRoot';
import { useEffect, useState } from "react";
import { Modal, Checkbox, Divider, message, Row, Col } from "antd";
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

const CheckboxGroup = Checkbox.Group;

export default (props) => {


  const { visible, record, onClose, onOk } = props;

  const [parts, setParts] = useState(null);
  const [optionsObject, setOptionsObject] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [checkedList, setCheckedList] = useState([]);

  const getParts = (char) => {
    const gparts = '100000000000000000000000000000'.split('');
    char.forEach(element => {
      const location = parseInt(element.toString().substring(2), 10);
      gparts[location - 1] = '1';
    });
    setParts(gparts.join(''));
  }

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < optionsArray.length);
    setCheckAll(list.length === optionsArray.length);
    getParts(list);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? optionsArray : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    getParts(e.target.checked ? optionsArray : []);
  };

  const getOptions = (keywords) => {
    Ajax.Post('BasicUrl', '/manage/devCat.selectAll',
      {
        ...keywords,
      },
      (ret: any) => {
        const list = [];
        ret.list.forEach(e => {
          list.push(e.cat_id);
        });
        setOptionsArray(list);
        setOptionsObject(ret.list);
      }
    );
  }

  const getDefalutOptions = (e) => {
    const defalutParts = e && e.parts ? e.parts.substring(10) : [];
    const returnChar = [];
    for (let i = 0; i < defalutParts.length; i++) {
      if (defalutParts.substring(i, i + 1) === '1') {
        returnChar.push(2011 + i);
      }
    }
    console.log("==returnChar==" + JSON.stringify(returnChar));
    setCheckedList(returnChar);
  }

  const handleSubmit = () => {
    let url;
    let param;
    if (record) {  //edit
      url = '/manage/devType.update';
      param = {
        parts: parts,
        oid: record && record.id,
      }
    }
    Ajax.Post('BasicUrl', url, param
      , (res: any) => {
        message.success('操作成功');
        // optionsRef.current.getForm().resetFields();
        onOk();
      }
    );
  }
  useEffect(() => {
    getOptions({ catIdPrefix: 2 });
    // setParts(record.parts)
    getDefalutOptions(record);
  }, [record]);

  return (
    <Modal
      visible={visible}
      title='设备部件编辑'
      onOk={() => handleSubmit()}
      onCancel={onClose}
      okText="提交"
      cancelText="取消"
      destroyOnClose>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange}
        checked={checkAll}>
        全选
      </Checkbox>
      <Divider />
      <CheckboxGroup value={checkedList} onChange={onChange} >
        <Row style={{ marginLeft: 6 }}>
          {optionsObject.map((item) =>
            <Col span={6} key={item.cat_id}>
              <Checkbox value={item.cat_id}>
                {item.cat_name}
              </Checkbox>
            </Col>)}
        </Row>
      </CheckboxGroup>
    </Modal>
  );
}