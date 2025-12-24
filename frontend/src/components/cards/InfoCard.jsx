import React from 'react'

const InfoCard = ({ label, value, color }) => {
  return (
    <div className={`${color} text-white rounded-xl p-4 shadow-md`}>
      <p className="text-xs md:text-sm opacity-90 mb-1">{label}</p>
      <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
    </div>
  )
}

export default InfoCard