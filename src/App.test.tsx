import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {App,FilterSearch,FilterData,Folder, filterOptions} from './App';
import { jsonData } from './JSONData';


test('Should render component with title', () => {
  render(<App />);
  const title = screen.getByText(/Documents/i);
  expect(title).toBeInTheDocument();
});

test('Should render the search component', () => {
  render(<FilterSearch />);
  const filter = screen.getByPlaceholderText(/Search.../i)
  expect(filter).toBeInTheDocument();
});

test('Should render the sort options', () => {
  render(<FilterSearch />);
  expect(screen.getByText(/Sort/)).toBeInTheDocument();
  expect(screen.getByText(/name/)).toBeInTheDocument();
  expect(screen.getByText(/type/)).toBeInTheDocument();
  expect(screen.getByText(/date/)).toBeInTheDocument();
});
 test('Should handle the sort filter', ()=> {
  const handleFilter = jest.fn()
  render(<FilterSearch handleFilter={handleFilter} />);
  //@ts-expect-error
  expect(screen.getByRole('option', {name: 'name'}).selected).toBeTruthy()
  userEvent.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', {name: 'type'})
    );
  //@ts-expect-error
  expect(screen.getByRole('option', {name: 'type'}).selected).toBeTruthy()
 })

 test('should render the data', ()=> {
  render(<FilterData data={jsonData}/>)
  expect(screen.getByText(/Public Holiday policy.pdf : 2016-12-06/)).toBeInTheDocument();
  expect(screen.getByText(/Employee Handbook.pdf : 2017-01-06/)).toBeInTheDocument();
  expect(screen.getByText(/Cost centres.csv : 2016-08-12/)).toBeInTheDocument();
})

test('should render the data within the Folder', ()=> {
  const mockDataForFolders = [{     
    "type": "folder",     
    "name": "Expenses",     
    "files": 
    [
        {         
            "type": "doc",         
            "name": "Expenses claim form",
            "added": "2017-05-02"
        },
        {         
            "type": "doc",
            "name": "Fuel allowances",
            "added": "2017-05-03"
        }
    ]
},    {     
  "type": "folder",     
  "name": "Misc",     
  "files": 
  [
      {         
          "type": "doc",         
          "name": "Christmas party",         
          "added": "2017-12-01"
      },
      {         
          "type": "mov",         
          "name": "Welcome to the company!",         
          "added": "2015-04-24"
      }
  ]
}]
  render(<Folder items={mockDataForFolders[0]}/>)
  fireEvent.click(screen.getByRole('button', {name: '📁 Expenses'}))

  expect(screen.getByText(/Expenses claim form.doc : 2017-05-02/)).toBeInTheDocument();
  expect(screen.getByText(/Fuel allowances.doc : 2017-05-03/)).toBeInTheDocument();

  render(<Folder items={mockDataForFolders[1]}/>)
  fireEvent.click(screen.getByRole('button', {name: '📁 Misc'}))
  expect(screen.getByText(/Christmas party.doc : 2017-12-01/)).toBeInTheDocument();
  expect(screen.getByText(/Welcome to the company!.mov : 2015-04-24/)).toBeInTheDocument();
})
test('should handle the filterOptions fn', () => {
  /**
   * There is something odd happening with this function, given the time constraint
   * I haven't had the opportunity to look into it.
   */
  expect(filterOptions(jsonData,'name')[0].name).toEqual("Cost centres")

  expect(filterOptions(jsonData,'type')[1].name).toEqual("Misc")
  expect(filterOptions(jsonData,'type')[3].name).toEqual("Employee Handbook")

  expect(filterOptions(jsonData,'added')[2].name).toEqual("Misc")
  expect(filterOptions(jsonData,'added')[4].name).toEqual("Employee Handbook")

})