"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';

import pics from '../code.jpg'

const GetUser = () => {
  const [data, setData] = useState(null);
  const [wallet_address, setWalletAddress] = useState(localStorage.getItem('wallet_address') || '');
  const [isCopied, setIsCopied] = useState(false);
  const text = wallet_address

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset   
  };
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${month} ${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      if(!wallet_address){
        console.log('wallet_address not found pls login')
      }
      try {
        const response = await fetch(`http://localhost:8000/user/${wallet_address}`, {
          headers: {
            'wallet-address': wallet_address
          }
        });
        const data = await response.json();
        console.log(data.data)
        setData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [wallet_address]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-gray-600 md:px-10 px-4 py-4">
      <Image src={pics} alt='img' className="w-full mb-10"/>
      <h1 className="text-xl font-semibold text-gray-800 mb-3">{data.fullname}</h1>
      <div className="flex justify-between py-1">
        <p className="text-xs">@{data.username  || 'Username'}</p>
        <div className="flex items-center justify-between gap-2">
          <svg className="" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 48 48">
          <path d="M 10.5 8 C 6.9280619 8 4 10.928062 4 14.5 L 4 33.5 C 4 37.071938 6.9280619 40 10.5 40 L 37.5 40 C 41.071938 40 44 37.071938 44 33.5 L 44 14.5 C 44 10.928062 41.071938 8 37.5 8 L 10.5 8 z M 10.5 11 L 37.5 11 C 39.450062 11 41 12.549938 41 14.5 L 41 15.605469 L 24 24.794922 L 7 15.605469 L 7 14.5 C 7 12.549938 8.5499381 11 10.5 11 z M 7 19.015625 L 23.287109 27.820312 A 1.50015 1.50015 0 0 0 24.712891 27.820312 L 41 19.015625 L 41 33.5 C 41 35.450062 39.450062 37 37.5 37 L 10.5 37 C 8.5499381 37 7 35.450062 7 33.5 L 7 19.015625 z"></path>
          </svg>
          <p className="text-xs md:text-base">{data.email || 'Email...'}</p>
        </div>
        <p className="text-xs font-semibold md:text-base">{data.occupation || 'Specialization'}</p>
      </div>
      <div className="flex justify-between py-1">
        <div className="flex gap-2 items-center">
          <img className="h-4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7klEQVR4nOWUPQrCQBCFvyMIYhCsjIIHsLDwGnoFwWuod5DoBbSw9gS26g0sbAV/KwsjAyuEMMbdJFb54EHgzbxJdpJAEfCACbADHkZbYGy8TPSBGxB+kXi9LOGvhPCPXmmGeD/uPIzpClRcBkyUkDMQGF0Uf+QyYK+E1yO+rwyRxVtzjzVPlZpAWbg1p1hzoNTMYzXSY81GOSI/4jeUI5Iea8bKEi/AzEhbsvRY07T8BsKIWjiydgiXWmfaDk/RISVLi3CpSU3VvEFJv4gaGRkkDBAvFxZK+IocKQGHSPgRKJMzXeBpJNd/YWhUIN7UbagHV+DHjAAAAABJRU5ErkJggg=="/>
          <p className="text-xs md:text-base">{data.location  ||  "Location..."}</p>
        </div>
        <div className="flex gap-2 items-center">
          <img className="w-4 h-4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACs0lEQVR4nO2ZP2sUQRjGf7mo2GW9aCrxA6SLJJcmH8O0KkjElGLhn0gUy4DaqIUKR1A/wMWgaIxEu5w26YRT09olcpgoMVkZeA9ehr3b3VszM8o9cM3t7PPOA/P+eWahhx7+a5wALgB3gWfAfWAGGAdK/AMYBV4DcYffOnAW6CdA9AGXgd0UEbH6vQeOERDMUakmbHQHqAM1YAXYSFjzCSgTiIh5a3NbwI2EDR4AJoGGtX7Jd94kifgmedIJA8Cy9d5pPOZENUHEcMb3B4DP6t2vwukcMwVEtDBpcVRwjFGrOnUjwuAgsKl4ruIYuk/8AE4W4FpRXKZpOu3Yeyr49YJ8C4rrCQ4xrQL/AgYL8n1UfLdxiDsq8IeE5xHwCvgJXEzhOgr8VnzncYinKvDzBBF19Xw7heuWWmuO63Ec4qEK/q6DiFiKQjtURGhr7Usc45oK/h041EZEXf5PwrCU7NZaU8pHcIwJa8PTkivdioh99I/WfKVHi7igiKqv0cTgXBcixhJEzPuees143swoYkiq07YrEbbHfiRnd8IKGGXMiVlgzeoT+jiVfHjsL3KcyhlFzLXh2QWu/O2c6JNRPI/HbnYpYk/6xIhrj20GuVVrxM6S2GU5jo/leJpxZmq/OnYej31Y5qU81SlIjx3lbHZBeuwo59gRpMeOMoooh+yxo4wi5nx77K2Ue6cXOUqsaZrePPZsyvpmho7dem5MlhePvQMcSVl/Se5oF9sk9loIHnu1INdQKB67VpDLq8d+oIK/LcAzFpLH3pBryrwIwmOPW+X0VM73g/LY62oTDbnSz4LgPPYZazPLGcRUQvTY/cAba1MN+T5h58yga4+dF2X58Gh7i025MazJhbIzj11UzFIOa2t6xU2fOdEJJckZXQCceez9ElSRUnrPhcfuoQfCwB9gx8Gher1xQgAAAABJRU5ErkJggg=="></img>
          <a className="text-xs md:text-base" href={data.portfolio}>{data.portfolio || 'portfolio...'}</a>
        </div>
      <div className="flex justify-center items-center gap-2">  
        <img className="w-4 h-4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAUklEQVR4nGNgGEDwH4qppY4+FngxMDA8RtL0n0QM0uuJzwJKDP8PxY+I8S6leARYQC74P2oBITAaRATBaBANgSB6TOvi2hOqgBLDPSgIAYYRCADcL62T0mj/WwAAAABJRU5ErkJggg==" />
        <p className="text-xs md:text-base">Joined{data.joinedAt || '...'}</p>
      </div>
      </div>
      <div className="flex items-center gap-2 py-1 mb-6">
        <img className="w-4 h-4" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA/klEQVR4nO3WP0rEUBDH8Q8i23gBawsvYKWClWDjDSzsBE+wteC6nsIDiL3FtpbewErYrez8U4iwkcAIIUQMmxeC8L4wzWMyv9+bN0kemUxatnGOO7zgGUd6ZBMnuAmxoiHK9WRs4BDXeMSyJlbu+hZn2Kqsr8w6djDGDJ81wY9YH0feWu35lQ0c4z4EqoJfeMAFDjDSA6cNre0aC0zbGn5KLF6NqzYGlpG8Kx17lU78SdF1crvWLbIB+Qh0HsLydXvHZKghfIsar0MZmISJy6EMNJENFPkItJytRSSWf7BU7EfNeZvkaY/3geqH6VdGYeKnEyliHuK9XOEy/5tvBqrCD3q5p2IAAAAASUVORK5CYII=" />
        <p className="text-xs md:text-sm">{data.wallet_address}</p>
        {isCopied ? <span className="text-xs">copied</span> : 
          <img onClick={handleCopy} width="17" height="17" src="https://img.icons8.com/fluency-systems-regular/50/copy--v1.png" alt="copy--v1"/>
        }
      </div>
      <div className="border border-gray-300 rounded-lg py-4 px-3 text-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-xl">Work Experience</p>
          <p>{data.workExperience && data.workExperience.length > 0 ? " " : "+"}</p>
        </div>
        {data.workExperience && data.workExperience.length > 0 ? (
          data.workExperience.map((experience, index) => (
            <div key={index} className="experience-item">
              <h3 className="py-1">{experience.company}</h3>
              <p className="py-1"><strong>Position:</strong> {experience.position}</p>
              <p className="py-1"><strong>Tenure:</strong>  {formatDate(experience.JoinedFrom)} - {experience.Till === 'Present' ? 'Present' : formatDate(experience.Till)}</p>
              <p className="py-1">{experience.description}</p>
            </div>
          ))
        ) : (
          <p>Add Work Experience</p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg py-4 px-3 text-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-xl">Skill & Expertise</p>
          <p>{data.SkillAndExpertise && data.SkillAndExpertise.length > 0 ? " " : "+"}</p>
        </div>
        {data.SkillAndExpertise && data.SkillAndExpertise.length > 0 ? (
          data.SkillAndExpertise.map((experience, index) => (
            <div key={index} className="experience-item">
              <p className="py-1"><strong>Position:</strong> {experience.skill}</p>
              <p className="py-1">{experience.Expertise}</p>
            </div>
          ))
        ) : (
          <p>Add Skill & Expertise</p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg py-4 px-3 text-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-xl">Bio</p>
          <p>{data.bio ? " " : "+"}</p>
        </div>
        {data.bio ? `${data.bio}` : "Add Skill & Expertise" }
      </div>
      
    </div>
  );
};

export default GetUser;