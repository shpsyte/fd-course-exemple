'use client';

import useSWR from 'swr';


function CapsLook(props) {  
  const t = props.text.toUpperCase();
  return <p>{t} {props.age}</p>;
}

 const fetchAPI = async (key) => {
  try {
   const response = await fetch(key);
  const responseJson = await response.json();
  return responseJson;
  } catch (error) {
    console.error(error);
 }
}
const StatusPage = () => {
  const response = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <div>
   
      <pre>
      {response.data && JSON.stringify(response.data, null, 2) }
      </pre>

      <UpdatedAt />
    </div>
  );
};

const UpdatedAt = () => {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {data && <p>Updated at: {new Date(data.updated_at).toLocaleString()}</p>}
    </div>
  );
}

export default StatusPage;