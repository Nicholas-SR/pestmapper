import { Drawer, Input, Col, Select, Form, Row, Button, Spin } from 'antd'
import { addNewReport } from './client'
import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { successNotification, errorNotification } from './Notification'
import Search from './Search'

const { Option } = Select

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const ReportDrawerForm = ({ showDrawer, setShowDrawer, fetchReports }) => {
  const onClose = () => setShowDrawer(false)
  const [submitting, setSubmitting] = useState(false)
  const [address, setAddress] = useState()
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()
  const [placeId, setPlaceId] = useState()

  const onFinishFailed = (errorInfo) => {
    // alert(JSON.stringify(errorInfo, null, 2))
  }

  const { TextArea } = Input

  const date = new Date()

  const onFinish = (report) => {
    setSubmitting(true)

    console.log(JSON.stringify(report, null, 2))
    addNewReport(report)
      .then(() => {
        onClose()
        successNotification(
          'Report successfully added',
          `${report.address} was added to the system`,
          'bottomRight'
        )
        fetchReports()
      })
      .catch((err) => {
        console.log(err)
        err.response.json().then((res) => {
          errorNotification(
            'There was an issue',
            `${res.message} [${res.status}] [${res.error}]`,
            'bottomLeft'
          )
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Drawer
      title="Create new report"
      width={720}
      onClose={onClose}
      visible={showDrawer}
      bodyStyle={{ paddingBottom: 80 }}
      style={{ zIndex: '11' }}
    >
      <Form
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        hideRequiredMark
        fields={[
          {
            name: ['address'],
            value: address
          },
          {
            name: ['placeId'],
            value: placeId
          },
          {
            name: ['lat'],
            value: lat
          },
          {
            name: ['lng'],
            value: lng
          },
          {
            name: ['day'],
            value: date.getDate()
          },
          {
            name: ['month'],
            value: date.getMonth()
          },
          {
            name: ['year'],
            value: date.getFullYear()
          }
        ]}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Please enter your name" maxLength={255} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: 'You must select an address from the drop down list'
                }
              ]}
            >
              <Search
                setAddress={setAddress}
                setLat={setLat}
                setLng={setLng}
                setPlaceId={setPlaceId}
                placeholder={'Please enter your address'}
                className={'drawerSearch'}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="bug"
              label="Infestation Type"
              rules={[
                {
                  required: true,
                  message: 'Please select the infestation type'
                }
              ]}
            >
              <Select placeholder="Please select the infestation type">
                <Option value="BEDBUG">Bedbugs</Option>
                <Option value="COCKROACH">Cockroaches</Option>
                <Option value="BOTH">Bedbugs & Cockroaches</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="score"
              label="Infestation Severity"
              rules={[
                {
                  required: true,
                  message: 'Please select the severity of the infestation'
                }
              ]}
            >
              <Select placeholder="Please select the severity of the infestation">
                <Option value="1">Mild</Option>
                <Option value="2">Moderate</Option>
                <Option value="3">Severe</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="comment"
              label="Comment"
              rules={[{ required: true, message: 'Please enter a comment' }]}
            >
              <TextArea
                rows={4}
                placeholder="Please enter a comment"
                maxLength={2040}
              />
            </Form.Item>
            <Form.Item
              name="lat"
              label="Lat"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
            <Form.Item
              name="lng"
              label="Lng"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
            <Form.Item
              name="placeId"
              label="PlaceId"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
            <Form.Item
              name="day"
              label="Day"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
            <Form.Item
              name="month"
              label="Month"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
            <Form.Item
              name="year"
              label="Year"
              rules={[{ required: true }]}
              style={{ display: 'none' }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item>
              <Button
                type="primary"
                style={{
                  backgroundColor: '#FF5E45',
                  fontSize: '18px',
                  height: '50px'
                }}
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row>{submitting && <Spin indicator={antIcon} />}</Row>
      </Form>
    </Drawer>
  )
}

export default ReportDrawerForm
