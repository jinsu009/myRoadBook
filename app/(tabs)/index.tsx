import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import axios from 'axios';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, Image } from 'react-native';

const ALADIN_API_KEY = process.env.EXPO_PUBLIC_ALADIN_API_KEY;
const API_URL = 'http://www.aladin.co.kr/ttb/api/ItemList.aspx';

export default function TabOneScreen() {

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNewBooks = async () => {
    try{
      setLoading(true);
      setError(null);
      setBooks([]); 

      const resp = await axios.get(API_URL, {
        params : {
          ttbkey : ALADIN_API_KEY,
          QueryType : 'ItemNewAll', // 신간전체
          MaxResults : 10, 
          start : 1,
          SearchTarget : 'Book',
          output : 'js', 
          Version : '20131101',
        }
      });

      if(resp.data && resp.data.item){
        setBooks(resp.data.item);
        console.log('성공: 알라딘 API에서 데이터를 가져왔습니다.');
        console.log(`총 ${resp.data.item.length}권의 책 정보를 가져왔습니다.`);
      }else {
        throw new Error('데이터 구조가 예상과 다릅니다.');
      }
    }catch(err : any){
      setError(err.message);
      console.error(" Fail : ", err.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        알라딘 API 연동 테스트
      </Text>
      
      {/* 폰 연결을 안 했으니 화면보다는 콘솔을 보세요! */}
      <Button title="신간 도서 가져오기" onPress={fetchNewBooks} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginTop: 10 }}>에러: {error}</Text>}
      {books.length > 0 && <Text style={{ marginTop: 10 }}>성공: 콘솔을 확인하세요!</Text>}
      
      {/* 나중에 집에서 폰 연결했을 때, 아래 FlatList로 책 목록을 보여줄 겁니다. */}
      <FlatList
        data={books}
        keyExtractor={(item : any) => item.itemId.toString()}
        renderItem={({ item } : any) => (
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Image source={{ uri: item.cover }} style={{ width: 50, height: 75, marginRight: 10 }} />
            <View>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>{item.author}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
