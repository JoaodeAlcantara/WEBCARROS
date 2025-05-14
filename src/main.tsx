import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './App.tsx';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.tsx';
import { Carprovider } from './contexts/CarContext.tsx';
import { MyCarsprovider } from './contexts/MyCarsContext.tsx';

createRoot(document.getElementById('root')!).render(

  <AuthProvider>
    <Carprovider>
      <MyCarsprovider>
        <RouterProvider router={router} />
      </MyCarsprovider>
    </Carprovider>
  </AuthProvider>

)
