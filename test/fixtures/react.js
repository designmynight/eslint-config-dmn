import React, { useEffect, useState } from 'react';

export default function Example(props) {
    if (props.visible) {
        useState(0);
    }
    useEffect(() => {
        console.log(props.visible);
    }, []);
    return (
      <label>
        <img
          src="example.png"
        />
      </label>
    );
}
