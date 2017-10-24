import React from 'react';
//import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';

const InfoScreen = ({info, infoType, infoText, onClickHandler}) => {
    let customClass = classNames({
        //'hide': !info,
        'info-screen': true,
        'alert': infoType == 'alert',
        'waiting': infoType == 'waiting'
    });

    const duration = 800;

    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out `,
        opacity: 0
    };

    const transitionStyles = {
        entering: { opacity: 0},
        entered: { opacity: 1},
        exiting: { opacity: 1},
        exited: { opacity: 0, transform: 'translateX(-110%)'}
    };

    return(
        <Transition in={info} timeout={duration}>
                {state =>(
                    <div className={customClass} style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }}>
                            <div className="info">{infoText}</div>
                            {infoType === 'waiting'
                                ?<div className='spinner'></div>
                                :''
                            }
                            {infoType === 'notification'
                                ?<a className='a-btn' onClick={onClickHandler}>OK</a>
                                :''
                            }
                    </div>)
                }
        </Transition>
    );
};

export default InfoScreen;
