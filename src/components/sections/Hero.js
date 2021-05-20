import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Globe from 'react-globe.gl';
import * as d3 from "d3";
import indexBy from 'index-array-by';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );
  
  const { useState, useEffect, useRef } = React;

  const COUNTRY = 'United States';
  const OPACITY = 0.22;

  const airportParse = ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]) => ({ airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source });
  const routeParse = ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]) => ({ airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment});
  
  const globeEl = useRef();
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    // load data
    Promise.all([
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, airportParse)),
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, routeParse))
    ]).then(([airports, routes]) => {

      const byIata = indexBy(airports, 'iata', false);

      const filteredRoutes = routes
        .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown airports
        .filter(d => d.stops === '0') // non-stop flights only
        .map(d => Object.assign(d, {
          srcAirport: byIata[d.srcIata],
          dstAirport: byIata[d.dstIata]
        }))
        .filter(d => d.srcAirport.country === COUNTRY && d.dstAirport.country !== COUNTRY); // international routes from country

      setAirports(airports);
      setRoutes(filteredRoutes);
    });
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 5.0;
  }, []);

  useEffect(() => {
    // aim at continental US centroid
    globeEl.current.pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 });
  }, []);
  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <div className={splitClasses}>

            <div className="split-item">
            <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  'split-item-image-fill'
                )}
                data-reveal-container=".split-item">

                <Globe
                  ref={globeEl}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"

                  arcsData={routes}
                  // arcLabel={d => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`}
                  arcStartLat={d => +d.srcAirport.lat}
                  arcStartLng={d => +d.srcAirport.lng}
                  arcEndLat={d => +d.dstAirport.lat}
                  arcEndLng={d => +d.dstAirport.lng}
                  arcDashLength={0.25}
                  arcDashGap={1}
                  arcDashInitialGap={() => Math.random()}
                  arcDashAnimateTime={4000}
                  arcColor={d => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`]}
                  arcsTransitionDuration={0}

                  pointsData={airports}
                  pointColor={() => 'orange'}
                  pointAltitude={0}
                  pointRadius={0.02}
                  pointsMerge={true}
                  backgroundColor="#151719"
                  height={600}
                  width={600}
                />
              </div>
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="hero-content">
                  <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
                    Landing page for <span className="text-color-primary">Everest</span>
                  </h1>
                  <div className="container-xs">
                    <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae sagittis erat, eu tincidunt diam.
                      </p>
                    <div className="reveal-from-bottom" data-reveal-delay="600">
                      <ButtonGroup>
                        <Button tag="a" color="primary" wideMobile href="https://cruip.com/">
                          Get started
                          </Button>
                        <Button tag="a" color="dark" wideMobile href="https://github.com/cruip/open-react-template/">
                          View on Github
                          </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;