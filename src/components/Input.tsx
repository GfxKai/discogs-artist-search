import React from 'react';
import './Input.css';

interface InputProps {
    value: string;
    placeholder?: string;
    handleChange: Function;
    onFocus: () => void;
    onBlur: () => void;
    style?: object;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    value,
    placeholder,
    handleChange,
    onFocus,
    onBlur,
    disabled = false,
    style = {}
}) => (
    <input
        className="input-box"
        style={ style }
        value={ value }
        placeholder={ placeholder }
        disabled={ disabled }
        onChange={ (e) => handleChange(e.target.value) }
        onFocus={ onFocus }
        onBlur={ onBlur }
    />
);

export default Input;
