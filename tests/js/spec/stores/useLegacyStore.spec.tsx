import {act, renderHook} from '@testing-library/react-hooks';

import TeamStore from 'app/stores/teamStore';
import {useLegacyStore} from 'app/stores/useLegacyStore';

describe('useLegacyStore', () => {
  // @ts-expect-error
  const team = TestStubs.Team();

  beforeEach(() => void TeamStore.reset());

  it('should update on change to store', () => {
    const {result} = renderHook(() => useLegacyStore(TeamStore));

    expect(result.current.teams).toEqual([]);

    act(() => TeamStore.loadInitialData([team]));

    expect(result.current.teams).toEqual([team]);
  });
});
