import { useState, useEffect } from 'react'
import { deleteStudent, getAllStudents } from "./client";
import  StudentDrawerForm  from "./StudentDrawerForm";
import { Layout, Menu, Breadcrumb, Table, Empty, Spin, Button, Badge, Avatar, Radio, Popconfirm } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';

import './App.css';
import { errorNotification, successNotification } from './notification';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const popconfirmText = "Are you sure you want to delete this student?"



const TheAvatar = ({name}) => {

  if(name.trim().length === 0){
    return <Avatar icon={<UserOutlined/>}/>
  }

  const split = name.trim().split(" ");
  if(split.length === 0){
    return <Avatar>{name.charAt(0)}</Avatar>
  }

  return <Avatar>
    {`${name.charAt(0)}${name.charAt(name.length-1)}`}
  </Avatar>
}

 const deleteStudentAndUpdate = (student,callback) => {

  deleteStudent(student)
    .then(() => {
      successNotification("Student deleted", `Student ${student.name} was successfully deleted!`);
      callback();
    });
 }

const columns = fetchStudents => [
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (text, student) => <TheAvatar name={student.name}/>
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: (text, student) => <Radio.Group>
    <Popconfirm placement="left" 
                title={popconfirmText} 
                onConfirm={ () => deleteStudentAndUpdate(student,fetchStudents) } 
                okText="Yes" 
                cancelText="No">
        <Radio.Button value="large" onClick={""}>Delete</Radio.Button>
    </Popconfirm>
    <Radio.Button value="default">Edit</Radio.Button>
  </Radio.Group>
  }
];


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                setFetching(false);
            }).catch(err => {

              console.log(err.response);
              err.response.json().then(res => {
                console.log(res);
                errorNotification("There was an issue", `${res.message} Code: ${res.status} [${res.error}]`);
              });
            }).finally(() => { setFetching(false)});

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
      if(fetching)
        return <Spin indicator={antIcon} />;

       if (students.length <= 0) {
          return <>
              <Button
                  onClick={() => setShowDrawer(!showDrawer)}
                  type="dashed" shape="round" icon={<PlusOutlined/>} size="medium">
                  Add New Student
              </Button>
              <StudentDrawerForm
                  showDrawer={showDrawer}
                  setShowDrawer={setShowDrawer}
                  fetchStudents={fetchStudents}
              />
              <Empty/>
          </>
      }
      
      return <>
      <StudentDrawerForm
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        fetchStudents={fetchStudents}
      />
      <Table 
      dataSource={students} 
      columns={columns(fetchStudents)}
      bordered
      title={() => 
      <>
      <Button
        type="dashed"
        onClick={() => setShowDrawer(!showDrawer)}
        shape="round" icon={<PlusOutlined />} size="medium">
      Add New Student
    </Button>
    <Badge count={students.length}/>
    </>}
      pagination={{ pageSize: 50 }}
      scroll={{ y:500 }}
      rowKey={(student) => student.id} 
      />
      </>;
    };


    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                  { renderStudents() }
                </div>
            </Content>
        </Layout>
    </Layout>
}

export default App;