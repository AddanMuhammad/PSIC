import React from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);


function SearchBar({ search, setSearch }) {
  return (
    <Space direction="vertical">
      <Search
        placeholder="input search text"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        style={{
          width: 200,
        }}
      />

    </Space>
  )
}

export default SearchBar