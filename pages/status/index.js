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
  // const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
  //   refreshInterval: 2000,
  // });

  // if (isLoading) return <p>Loading...</p>;
  // if (!data) return <p>No data</p>;

  return (
    <div>
      <h1>Status</h1>
      {/* <p>Last Update: {data}</p> */}
   
      <pre>
          {/* {JSON.stringify(data, null, 2) } */}
      </pre>

      <UpdatedAt />
      <DatabaseStatus />
    </div>
  );
};


const DatabaseStatus = () => {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && !data && <p>No data</p>}

      <h2>Database Status</h2>
      <p>Version: {data.dependencies.database.version}</p>
      <p>MaxConn: {data.dependencies.database.max_connections}</p>
      <p>OpenConn: {data.dependencies.database.open_connections}</p>

      <pre>
      {data && JSON.stringify(data, null, 2)}       
      </pre>

    </div>
  );
}

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