import React from 'react';

const Legacy_widget = 'span';
const Other_widget = 'span';
const InputField = 'input';

export default function Example() {
    return (
        <section>
            <Legacy_widget />
            <Other_widget />
            <label>Valid<InputField /></label>
            <label>Invalid<span /></label>
        </section>
    );
}
