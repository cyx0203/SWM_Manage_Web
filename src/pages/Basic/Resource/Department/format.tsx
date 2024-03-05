export default class {
    static formatDeptList(deptList) {
        const formatList = [];
        let rightParId = -1;
        deptList.forEach(obj => {
            let row = 0;
            if (rightParId !== obj.parId) {
                // 如果是新的parId，计算rowSpan值         
                deptList.forEach(obj2 => {
                    if (obj.parId === obj2.parId) {
                        row += 1;
                    }
                })
                rightParId = obj.parId;
            }
            formatList.push({
                deptCode1st: obj.parId,
                deptName1st: obj.deptName1st,
                deptOrder1st: obj.deptOrder1st,
                deptActive1st: obj.deptActive1st,
                deptPrompt1st: obj.deptPrompt1st,
                deptCode2nd: obj.id,
                deptPosition2nd: obj.position,
                deptName2nd: obj.name,
                deptDesc2nd: obj.desc,
                deptOrder2nd: obj.order,            
                rowSpan: row,
            });
        });
        return formatList;
    }
}