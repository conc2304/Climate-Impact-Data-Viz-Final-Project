import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

import { Routes } from '../../router/router';
import Layout from '../ui/Layout';
import { StormDataType } from '../visualizers/data/types';
import CircleBarChart from '../visualizers/CircleBarChart';

const HomePage = () => {
  const [stormData, setStormData] = useState<StormDataType[]>(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const promises = [d3.json('/Climate-Impact-Data-Viz-Final-Project/data/Storm_Data_Sums.json')];

    Promise.all(promises).then((data) => {
      setStormData(data[0] as StormDataType[]);
    });
  }, []);

  return (
    <Layout>
      <main className="p-4 flex-grow-1 d-flex flex-column">
        <Row className="flex-grow-1 p-2">
          <Col lg={6} xl={7} className="h-100 d-flex flex-column">
            <Row className="flex-grow-1">
              <CircleBarChart stormData={stormData} id="hurricane-chart" />
            </Row>
          </Col>
          <Col
            lg={6}
            xl={5}
            className="d-flex justify-content-center flex-column"
            style={{ paddingBottom: 60 }}
          >
            <h1 className="pb-3 fs-2 flicker-container">
              <span className="text-glitch">Is </span>
              <span className="text-glitch">Earth </span>
              <span className="text-glitch">Fighting </span>
              <span className="text-glitch">Back?</span>
            </h1>

            <p className="pb-2 text-white">
              As time progresses, Earth is getting warmer and we are seeing more storms every year.
              The graphic on the left shows the change in the number of storm events over the last
              71 years (since 1950) in each US state and how it relates to that year's global
              temperature anomaly (in red). Nineteen of the hottest years have occurred since 2000,
              and as temperatures increase, so do the occurrences of severe weather.
            </p>

            <h2 className="pb-2 fs-3 flicker-container alt-flicker">
              <span className="text-glitch"> Are we </span>
              <span className="text-glitch">running </span>
              <span className="text-glitch">out of </span>
              <span className="text-glitch">time?</span>
            </h2>
            <p className="text-white">
              As temperatures change, what does that mean for the state of severe weather in the US?
              On the next page, you can explore how changes in temperature have had effects not only
              on different types of weather events in the US, but also how these storms distinctly
              impact particular regions over time.
            </p>
            <p onClick={handleShow}>
              <strong className="pb-2 text-white action-text">About Temperature Anomalies</strong>
              <span className="info">i</span>
            </p>
          </Col>
        </Row>
      </main>
      <footer
        className="d-flex justify-content-center"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Link
          to={Routes.storms}
          className="btn btn-primary btn-lg border-radius-0 d-block p-3 pb-2 custom-footer home-page"
        >
          <strong style={{ width: '200px' }}>Explore &#9661;</strong>
        </Link>
      </footer>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="flicker-container">
              <strong>About </strong>
              <strong>Temperature</strong>
              <strong> Anomalies</strong>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-white">
            In climate change studies, temperature anomalies are more important than absolute
            temperature. A temperature anomaly is the difference from a baseline temperature,
            typically computed by averaging 30 or more years of data.
          </p>
          <p className="text-white">
            Using anomalies, the departure from an “average” allows more accurate descriptions over
            larger areas and provides a frame of reference for easier analysis. Here we see that our
            <span className="text-ui-primary"> baseline</span> is
            <span className="text-ui-primary"> 0 degrees Celsius</span>. The starting point for
            measuring temperature was in the late 1800, when reliable recording became available.
            Today, the planet has already warmed a little more than 1 degree Celsius.
          </p>
          <p className="text-white">
            Scientists agree that at an increase of{' '}
            <strong className="text-ui-primary">+3° </strong> globaly, we will reach an irreversible
            tipping point.
          </p>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default HomePage;
