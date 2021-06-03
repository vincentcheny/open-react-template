import React, { Suspense } from 'react'
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import { Canvas } from '@react-three/fiber';
import Model from './Model';

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
                <div style={{ position: "relative", width: 700, height: 700 }}>
                  <Canvas
                    camera={{
                      position: [1,1,1],
                      zoom: 2,
                    }}
                  >
                    <pointLight position={[-10, -10, -10]} intensity={2.0}/>
                    <Suspense fallback={null}>
                      <Model />
                    </Suspense>
                  </Canvas>
                </div>
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