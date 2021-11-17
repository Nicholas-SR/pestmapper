import { Input, Col, Form, Row, Spin } from 'antd'
import { addNewReport } from './client'
import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { successNotification, errorNotification } from './Notification'
import Search from './Search'


/* 🐜 ---------------------------------------- 🐜 ---------------------------------------- 🐜 */
// MATERIALUI IMPORTS

import ReactDOM from 'react-dom';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

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
        anchor={'right'}
        open={showDrawer}
        onClose={onClose}
        style={{ zIndex: '11'}}
      >

        <div className="drawertitle">
          Report Pest
        </div>

        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr',
            gridTemplateAreas: 
            `'formcontrol formcontrol'
             'nameinput emailinput'
             'drawerSearch drawerSearch'
             'infestationtype infestationtype'
             'infestationseverity infestationseverity'
             'comment comment'
             'submitbutton submitbutton'`,
            gridRowGap: '40px',
            gap: '40px'

          }}
          autoComplete="off"
        >
        <FormControl
          className="formcontrol"
          // onFinishFailed={onFinishFailed}
          onSubmit={onFinish}
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

        </FormControl>

            <TextField
              required
              className="nameinput"
              id="standard-basic" 
              name="name" 
              label="Name" 
              variant="standard"
              inputProps={{maxLength:255}}
            />

            <TextField
              required
              className="emailinput"
              id="standard-basic" 
              name="email" 
              label="Email" 
              variant="standard"
              inputProps={{maxLength:255}}
            />

            <Search
              required
              name="address"
              className="drawerSearch"
              id="standard-basic" 
              label="Address" 
              variant="standard"

              setAddress={setAddress}
              setLat={setLat}
              setLng={setLng}
              setPlaceId={setPlaceId}
              placeholder={'Address'}
            />

            <div className="infestationtype">
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Infestation Type
              </InputLabel>
              <Select
                required
                name="bug"
                label="Infestation Type"
                id="infestationtype"
                style={{minWidth: '100%'}}
              >

                <MenuItem value="BEDBUG">Bedbugs</MenuItem>
                <MenuItem value="COCKROACH">Cockroaches</MenuItem>
                <MenuItem value="MICE">Mice</MenuItem>
                <MenuItem value="RATS">Rats</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
              <FormHelperText>What kind of pest?</FormHelperText>
            </div>

            <div className="infestationseverity">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Infestation Severity
            </InputLabel>
            <Slider
              defaultValue={3}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={5}
              id="infestationseverity"

            ></Slider>
            <FormHelperText>How bad is the infestation?</FormHelperText>

            </div>


            <TextField
              required
              className="comment"
              label="Comments"
              name="comment"
              multiline
              rows={6}
              // defaultValue="Describe the Infestation"
              variant="filled"
              inputProps={{maxLength:2040}}
            />

            <Button
              type="primary"
              htmlType="submit"
              className="submitbutton"
            >
              Submit
            </Button>
            {/* </FormControl> */}

        </Box>
      </Drawer>


    /* <Drawer
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
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Please enter your email" maxLength={255} />
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
                placeholder={'Please enter your address'}
                className={'drawerSearch'}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              style={{color: 'white'}}
              name="comment"
              label="Comments"
              rules={[{ required: true, message: 'Describe the infestation' }]}
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
    </Drawer> */
  )
}

export default ReportDrawerForm
