# TanStack Query + Offline Support Guide

This guide explains how to use TanStack Query with offline support in your Pokedex PWA.

## Architecture Overview

Your app now has a complete offline-first architecture:

1. **TanStack Query** - Data fetching, caching, and synchronization
2. **Dexie.js** - IndexedDB wrapper for offline data storage
3. **Automatic Sync** - Syncs pending operations when back online
4. **Cache Persistence** - Query cache persists across sessions

## File Structure

```
src/
├── api/
│   └── queries.js           # Supabase query functions
├── hooks/
│   └── usePokemons.js       # TanStack Query hooks
├── lib/
│   ├── queryClient.js       # Query client configuration
│   ├── offlineDb.js         # Dexie database schema
│   └── syncService.js       # Offline sync logic
└── components/
    └── PokemonExample.jsx   # Example usage component
```

## Available Hooks

### `usePokemons()`
Fetches all available pokemons from Supabase.

```jsx
import { usePokemons } from '../hooks/usePokemons';

function MyComponent() {
  const { data, isLoading, isError, error } = usePokemons();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.map(pokemon => (
        <div key={pokemon.id}>{pokemon.name}</div>
      ))}
    </div>
  );
}
```

**Features:**
- Cached for 1 hour (fresh)
- Stays in cache for 24 hours
- Works offline automatically
- Auto-refetches on reconnect

### `usePokedex(userId)`
Fetches user's caught pokemons (pokedex entries).

```jsx
import { usePokedex } from '../hooks/usePokemons';

function MyPokedex({ userId }) {
  const { data, isLoading, isError } = usePokedex(userId);

  if (isLoading) return <div>Loading your pokedex...</div>;

  return (
    <div>
      {data.map(entry => (
        <div key={entry.id}>
          {entry.nickname || entry.pokemons.name}
        </div>
      ))}
    </div>
  );
}
```

**Features:**
- Cached for 5 minutes (fresh)
- Stays in cache for 24 hours
- Only fetches when userId is provided
- Works offline automatically

### `useCatchPokemon()`
Mutation hook to catch a pokemon (add to pokedex).

```jsx
import { useCatchPokemon } from '../hooks/usePokemons';

function CatchButton({ pokemonId, userId }) {
  const catchMutation = useCatchPokemon();

  const handleCatch = async () => {
    try {
      await catchMutation.mutateAsync({
        userId,
        pokemonId,
        nickname: 'My Pikachu' // Optional
      });
      alert('Pokemon caught!');
    } catch (error) {
      alert('Failed to catch, will retry when online');
    }
  };

  return (
    <button
      onClick={handleCatch}
      disabled={catchMutation.isPending}
    >
      {catchMutation.isPending ? 'Catching...' : 'Catch'}
    </button>
  );
}
```

**Features:**
- Optimistic updates (instant UI feedback)
- Queues operation if offline
- Auto-syncs when back online
- Automatic cache invalidation

### `useReleasePokemon()`
Mutation hook to release a pokemon (remove from pokedex).

```jsx
import { useReleasePokemon } from '../hooks/usePokemons';

function ReleaseButton({ pokedexEntryId }) {
  const releaseMutation = useReleasePokemon();

  const handleRelease = async () => {
    try {
      await releaseMutation.mutateAsync(pokedexEntryId);
      alert('Pokemon released!');
    } catch (error) {
      alert('Failed to release, will retry when online');
    }
  };

  return (
    <button
      onClick={handleRelease}
      disabled={releaseMutation.isPending}
    >
      Release
    </button>
  );
}
```

## Offline Support

### How It Works

1. **Online Mode:**
   - Fetches data from Supabase
   - Saves to IndexedDB automatically
   - Updates cache

2. **Offline Mode:**
   - Reads from IndexedDB cache
   - Queues mutations for later
   - Shows cached data instantly

3. **Back Online:**
   - Automatically syncs pending operations
   - Refetches fresh data
   - Updates UI

### Connection Status

Check if user is online/offline:

```jsx
import { getConnectionStatus } from '../lib/syncService';

function ConnectionBadge() {
  const status = getConnectionStatus();

  return (
    <div className={status.isOnline ? 'online' : 'offline'}>
      {status.label}
    </div>
  );
}
```

### Manual Sync

Manually trigger sync of pending operations:

```jsx
import { syncPendingOperations } from '../lib/syncService';
import { queryClient } from '../lib/queryClient';

async function handleManualSync() {
  const syncedCount = await syncPendingOperations(queryClient);
  console.log(`Synced ${syncedCount} operations`);
}
```

## Cache Configuration

Default cache settings (configured in [queryClient.js](src/lib/queryClient.js)):

- **Queries:**
  - `gcTime`: 24 hours (how long cache is kept)
  - `staleTime`: 5 minutes (when data is considered stale)
  - `retry`: 3 attempts
  - `networkMode`: offlineFirst

- **Mutations:**
  - `networkMode`: offlineFirst
  - `retry`: 2 attempts

### Custom Cache Settings

Override defaults for specific queries:

```jsx
const { data } = usePokemons({
  staleTime: 1000 * 60 * 30, // Fresh for 30 minutes
  gcTime: 1000 * 60 * 60 * 48, // Cache for 48 hours
});
```

## Database Schema

IndexedDB stores (defined in [offlineDb.js](src/lib/offlineDb.js)):

- **pokemons** - All available pokemons
- **pokedex** - User's caught pokemons
- **pendingOperations** - Queued operations when offline
- **syncMetadata** - Sync status tracking

## DevTools

React Query DevTools are installed and available in development mode. Press the TanStack Query icon in the bottom corner to:

- Inspect query cache
- See query status
- Manually refetch queries
- Clear cache
- Monitor network requests

## Best Practices

1. **Always check loading states:**
   ```jsx
   if (isLoading) return <Loading />;
   if (isError) return <Error />;
   ```

2. **Use optimistic updates for better UX:**
   The mutation hooks already implement this.

3. **Handle offline gracefully:**
   Show connection status and queue indicators.

4. **Let TanStack Query handle caching:**
   Don't manage cache manually unless necessary.

5. **Use query keys consistently:**
   - `['pokemons']` - All pokemons
   - `['pokedex', userId]` - User's pokedex

## Troubleshooting

### Cache not persisting
- Check browser IndexedDB is enabled
- Ensure localStorage is available
- Check browser console for errors

### Offline sync not working
- Verify `setupOnlineSync()` is called in [main.jsx](src/main.jsx)
- Check browser console when going online/offline
- Look for pending operations in DevTools

### Queries not updating
- Check `staleTime` - data may be considered fresh
- Use `refetch()` to force update
- Check network tab for actual requests

## Example Implementation

See [PokemonExample.jsx](src/components/PokemonExample.jsx) for a complete working example showing:
- Fetching pokemons
- Fetching pokedex
- Catching pokemons
- Releasing pokemons
- Connection status display
- Loading and error states

## Further Reading

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Dexie.js Docs](https://dexie.org/)
- [PWA Offline Patterns](https://web.dev/offline-cookbook/)
