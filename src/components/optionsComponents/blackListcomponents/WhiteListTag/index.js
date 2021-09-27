import React from 'react';
import './styles.css';

const WhiteListTag = (props) => {
    const onDelete = props.onDelete;
    const tagText = props.tagText;

    return (
        <div className='tag' onClick={onDelete}>
            {tagText}
            <span className='closeButton'>x</span>
        </div>
    );
};

export default WhiteListTag;