import React from 'react';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import{duration, defaultStyle, transitionStyles } from '../animation.config';

const InfoScreen = ({screen,infoType, infoText, onClickHandler, sendResponse}) => {
    let customClass = classNames({
        'info-screen': true,
        'alert': infoType == 'alert',
        'waiting': infoType == 'waiting'
    });

    return(
        <Transition in={screen=='info'} timeout={duration}>
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
                            {infoType === 'request'
                                ?   <div className='game-request-manager-bar'>
                                        <a className='green a-btn' onClick={()=>{sendResponse(true)}}>Confirm</a>
                                        <a className='red a-btn' onClick={()=>{sendResponse(false)}}>Reject</a>
                                    </div>
                                :''
                            }
                    </div>)
                }
        </Transition>
    );
};

export default InfoScreen;
