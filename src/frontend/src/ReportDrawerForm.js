import { Drawer, Input, Col, Select, Form, Row, Button, Spin } from 'antd'
import { addNewReport } from './client'
import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { successNotification, errorNotification } from './Notification'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox'
import { v4 as uuidv4 } from 'uuid'

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
              <Input placeholder="Please enter report name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Please enter report email" />
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
              label="Infestation Severity (5 is most severe)"
              rules={[
                {
                  required: true,
                  message: 'Please select the severity of the infestation'
                }
              ]}
            >
              <Select placeholder="Please select the severity of the infestation">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
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
              />
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
              <TextArea rows={4} placeholder="Please enter a comment" />
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

const Search = (props) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      // this sets the search to be within this radius, its around hamilton
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000
    }
  })

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleSelect = async (address) => {
    setValue(address)
    props.setAddress(address)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      const placeId = results[0].place_id
      const { lat, lng } = await getLatLng(results[0])
      props.setLat(lat)
      props.setLng(lng)
      props.setPlaceId(placeId)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Please enter your address"
          style={{
            maxHeight: '32px',
            fontSize: '15px',
            top: '-16px',
            position: 'relative'
          }}
        />
        <ComboboxPopover style={{ zIndex: '12' }}>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={uuidv4()} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}
