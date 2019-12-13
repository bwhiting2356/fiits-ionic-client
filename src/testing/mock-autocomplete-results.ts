import { AutocompleteResult } from '../app/shared/maps/autocomplete-result';

export const mockAutocompleteResults: AutocompleteResult[] = [
    {
      place_id: 'abc',
      structured_formatting: {
        main_text: 'Oyster Point',
        secondary_text: 'South San Francisco, CA, USA'
      }
    },
    {
      place_id: '123',
      structured_formatting: {
        main_text: 'Highland Hospital',
        secondary_text: 'East 31st Street, Oakland, CA, USA'
      }
    },
  ];
