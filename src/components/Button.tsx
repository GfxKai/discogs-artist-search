import React from 'react';
import './Button.css';

interface ButtonProps {
    label: string;
    action: Function;
    toggleState?: boolean;
    style?: object;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    action,
    toggleState,
    style = {},
    disabled = false
}) => (
    <button
        className={ toggleState ? 'button toggled' : 'button' }
        style={ style }
        type="button"
        onClick={ () => action() }
        disabled={ disabled }
    >
        { label }
    </button>
);

export default Button;
