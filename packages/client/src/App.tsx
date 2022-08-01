import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Router from 'routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

App.displayName = 'App';

export default App;
