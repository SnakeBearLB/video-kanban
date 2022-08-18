import useSyncContext from './useSyncContext';
import { renderHook } from '@testing-library/react-hooks';

describe('the useSyncContext hook', () => {
  it('should throw an error if used outside of the SyncProvider', () => {
    const { result } = renderHook(useSyncContext);
    expect(result.error.message).toBe('useSyncContext must be used within a SyncProvider');
  });
});
