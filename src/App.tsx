import React from 'react';
import './App.css';
import { jsonData } from './JSONData';

/**
 * 
 * @param param0 JSON objects with type 'folder'
 * @returns JSX in folder form with a collapsing list of contents
 */
export const Folder = ({items}:any) => {
  const [contents,showContents] = React.useState(false)
  return <>
  <button onClick={()=>showContents(!contents)}>{'📁 '+items.name}</button>
  {contents ? items.files.map((item :any)=> (
    <ul className='Items' key={item.name}>{item.name+'.'+item.type+' : '+item.added}</ul>
  )) : null}
  </>
}
/**
 * 
 * @param param0 JSON object
 * @returns JSX elements in a list of items or Folders
 */
export const FilterData = ({data}:any) => {
  return <>
  {data.map((data:any)=> data.type!=='folder' ? 
  <div className='Items' key={data.name}>{data.name+'.'+data.type+' : '+data.added}</div> :
  <Folder items={data} key={data.name}/>)}
  </>
}

/**
 * 
 * @param param0 a callback filter to set the filter value in parent
 * @returns JSX for the input and sort elements
 */
export const FilterSearch = ({handleFilter}:any) => {
  const [value,setValue] = React.useState()
  const handleChange = (event:any) => {
    setValue(event.target.value)
    handleFilter(value)
  };
return (
  <div className='filter'>
  <input placeholder='Search...'></input>
  Sort
  <select test-id='select' value={value} onChange={handleChange}>
    <option value='name'>name</option>
    <option value='type'>type</option>
    <option value='date'>date</option>
  </select>
  </div>
)
}
/**
 * 
 * @param data JSON object
 * @param filter used to return sorted JSON object
 * @returns 
 */
export const filterOptions = (data:any, filter:string) => {

  if ( filter === 'name') {
    data.sort((a:any,b:any)  => (a.name > b.name) ? 1 : -1)
  } else if ( filter === 'type') {
    data.sort((a:any,b:any)  => (a.type > b.type) ? 1 : -1)
  } else if ( filter === 'added') {
    data.sort((a:any,b:any)  => a.added && b.added ? ( a.added > b.added) ? 1 : -1 : 0)
  }
  return data
}
/**
 * 
 * @returns Main Component
 */

export const App =() => {
  const [data,setData] = React.useState(jsonData)
  const [filter,setFilter] = React.useState('')
  const handleFilter = (value:string) => setFilter(value)
  
  React.useEffect(()=> {
    setData(filterOptions(data,filter))
  },[data,filter])

  return (
    <div className='App'>
      Documents
    <div className='Main'>
      <FilterSearch handleFilter={handleFilter} />
      <FilterData data={data} />
    </div>
    </div>
  );
}
