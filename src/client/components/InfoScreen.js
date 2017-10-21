import React from 'react';
//import PropTypes from 'prop-types';
import classNames from 'classnames';

const InfoScreen = ({infoType, infoText}) => {
    let customClass = classNames({
        'hide': !infoType ,
        'block-screen': true,
        'info-screen': true,
        'alert': infoType == 'alert',
        'waiting': infoType == 'waiting'
    });

    return(
        <div className={customClass}>
            <div className="info">{infoText}</div>
            {infoType == 'waiting'
                ?<div className='spinner'></div>
                :''
            }
        </div>
    );
};

export default InfoScreen;