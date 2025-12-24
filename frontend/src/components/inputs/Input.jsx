import React, { useState } from 'react';
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const Input = ({ label, placeholder, type, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div>
           <label className='text-[13px] text-slate-800'>{label}</label>
           <div className="input-box">
            <input 
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                value={value}
                placeholder={placeholder}
                className='w-full outline-none bg-transparent'
                onChange={(e) => onChange(e)}
            />
        

        {type === "password" && (
            <>
                {showPassword ? (
                    <FaRegEye size={22} className='text-primary cursor-pointer'
                        onClick={() => toggleShowPassword()}
                    />
                ) : (
                    <FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer'
                        onClick={() => toggleShowPassword()}
                    />
                )}
            </>
        )}
           </div>
       </div>
    )
}

export default Input;