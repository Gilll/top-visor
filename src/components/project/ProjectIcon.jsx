import React from 'react';

const ProjectIcon = () => {
    return (
        <svg className="project-icon" width="57" height="57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity=".25" width="57" height="57" rx="28.5" fill="#87D449"/>
            <mask id="a" style={{"maskType":"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="57" height="57">
                <rect width="57" height="57" rx="28.5" fill="#53F0B8"/>
            </mask>
            <g mask="url(#a)">
                <path d="M31 41c0-8.284 6.716-15 15-15h18c8.284 0 15 6.716 15 15v6c0 8.284-6.716 15-15 15H46c-8.284 0-15-6.716-15-15v-6Z" fill="#6ABE27"/>
                <path d="M31 41c0-8.284 6.716-15 15-15h18c8.284 0 15 6.716 15 15v6c0 8.284-6.716 15-15 15H46c-8.284 0-15-6.716-15-15v-6Z" fill="#fff" fillOpacity=".1"/>
                <g filter="url(#b)"><path d="M-8 15h32c8.284 0 15 6.716 15 15v30H-8V15Z" fill="url(#c)"/>
                    <path d="M-8 15h32c8.284 0 15 6.716 15 15v30H-8V15Z" fill="#fff" fillOpacity=".1"/>
                </g>
                <path d="M27.518 49.973c0-8.008 6.491-14.5 14.5-14.5h10.936c8.008 0 14.5 6.492 14.5 14.5v6.79c0 8.009-6.492 14.5-14.5 14.5H42.018c-8.009 0-14.5-6.491-14.5-14.5v-6.79Z" stroke="#fff"/>
            </g>
            <defs>
                <linearGradient id="c" x1="20.259" y1="26.725" x2="14.874" y2="59.898" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#87D449"/><stop offset="1" stopColor="#7ACD37"/>
                </linearGradient>
                <filter id="b" x="-8" y="15" width="51" height="49" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="4" dy="4"/><feGaussianBlur stdDeviation="9"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                    <feBlend in2="shape" result="effect1_innerShadow_2345_161616"/>
                </filter>
            </defs>
        </svg>
    );
};

export default ProjectIcon;