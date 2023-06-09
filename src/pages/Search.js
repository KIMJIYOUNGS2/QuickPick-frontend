import React from "react";
import styles from "./Search.module.scss";
import Navbar from "../components/Navbar";
import SearchHeader from "../components/SearchHeader";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import SelectStore from "../components/SelectStore";
import axios from "axios";

export default function Search() {
  // 매장 데이터
  const [stores, setStores] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/stores/").then((response) => {
      const data = response.data;
      const stores = {};
      data.forEach((store, index) => {
        stores[store.pk] = store.name;
      });
      setStores(stores);
    });
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/products/").then((response) => {
      const apiData = response.data.map((item) => ({
        id: item.pk,
        name: item.name,
        price: item.price,
        image: item.image,
        product_location: item.product_location.map(
          (storePk) => stores[storePk]
        ),
      }));
      setData(apiData);
      console.log(apiData);
    });
  }, [stores]);

  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [inputValue, setInputValue] = useState("");
  const handleStoreSelect = (selectedStoreKey) => {
    // 추가
    setSelectedStore(selectedStoreKey);
  };

  const handleSearch = (searchTerm) => {
    setInputValue(searchTerm);
    if (selectedStore === "") {
      alert("먼저 매장을 선택하세요.");
      return;
    }
    // 검색 결과 초기화
    setSearchResults([]);

    // 선택된 매장 이름 가져오기
    const selectedStoreName = stores[selectedStore];

    // 검색 기능 구현
    const results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        item.product_location.includes(selectedStoreName)
    );

    setSearchResults(results);
    setSearchPerformed(true);

    // 최근 검색어에 추가
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((keyword) => keyword !== searchTerm),
    ];
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedSearches.slice(0, 5))
    );
  };

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const recentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(recentSearches);
  }, []);

  useEffect(() => {
    if (searchPerformed) {
      handleSearch(inputValue); // 매장을 변경할 때마다 현재 입력된 검색어로 검색을 수행합니다.
    }
  }, [selectedStore, searchPerformed]);

  // navbar의 search 아이콘 눌렀을 때 화면 초기화 시키기
  const [resetInput, setResetInput] = useState(false);

  const resetSearch = () => {
    setSearchResults([]);
    setSearchPerformed(false);
    setResetInput(true);
  };

  useEffect(() => {
    if (resetInput) {
      setResetInput(false);
    }
  }, [resetInput]);

  const getRandomArrayElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // 중복 없이 랜덤한 배열 요소를 n개 반환하는 함수
  const getRandomArrayElements = (arr, n) => {
    const shuffledArray = [...arr].sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, n).map((item) => item.name);
  };

  const handleKeywordClick = (keyword) => {
    setInputValue(keyword); // 클릭된 키워드를 inputValue 상태에 저장
    handleSearch(keyword); // 클릭된 키워드로 검색 수행
  };

  return (
    <>
      <SearchHeader />
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <SearchBar onSearch={handleSearch} resetInput={resetInput} />
            {!searchPerformed ? (
              <div>
                <div className={styles.searchKeyword}>
                  <div className={styles.searchKeywordTitle}>최근 검색어</div>
                  <div className={styles.searchKeywordList}>
                    {recentSearches.map((keyword, index) => (
                      <div
                        key={index}
                        className={styles.searchKeywordItem}
                        onClick={() => handleKeywordClick(keyword)}
                      >
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.searchKeyword}>
                  <div className={styles.searchKeywordTitle}>인기 검색어</div>
                  <div className={styles.searchKeywordList}>
                    {getRandomArrayElements(data, 1).map((name, index) => (
                      <div
                        key={index}
                        className={styles.searchKeywordItem}
                        onClick={() => handleKeywordClick(name)}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div>찾으시는 상품이 없습니다.</div>
            ) : (
              <>
                <div className={styles.searchResultText}>
                  총 {searchResults.length}건의 상품이 검색되었습니다.
                </div>
                <div className={styles.productsContainer}>
                  {searchResults.map((result, index) => (
                    <div key={index} className={styles.product}>
                      <img src={result.image} className={styles.image} />
                      <div className={styles.productInfo}>
                        <div>{result.name}</div>
                        <div>{result.price}</div>
                        {/* <div>{result.product_location}</div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <SelectStore onStoreSelect={handleStoreSelect} stores={stores} />
      <Navbar onSearchIconClick={resetSearch} />
    </>
  );
}
