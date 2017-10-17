import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InfoScreen = ({type, text,suicideTimeout}) => {
    let customClass = classNames({
        'block-screen': true,
        'alert': type == 'alert',
    });

    return(<div className={customClass}>

    </div>);
};

export default InfoScreen;