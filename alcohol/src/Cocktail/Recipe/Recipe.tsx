import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlcoholSearch from "../../alcohol/AlcoholSearch/AlcoholSearch";
import { addr } from "../../Common/serverAddr";
import { Cocktail } from "../../interface/cocktail/cocktail";
import { RecipeList } from "../../interface/RecipeList";
import RecipeListco from "./RecipeListco";


const Recipe = () => {
    const {id} = useParams();
    const [recipeList,setRecipeList] = useState<RecipeList[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const list = async (id:string,category:string) => {
        setLoading(true);
        setRecipeList([]);
        
        if(id!==''){
            const numId = parseInt(id);
            
            fetch(addr+'/cocktail/alchoCock',{
                method:"Post",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    id:numId,
                    category:category
                }),
            }).then((res)=>res.json())
            .then(async res => {
                if(res.success!==undefined){
                    if (!window.confirm("해당 술을 사용한 칵테일이 없어요\n대신 이 술과 같은 종류의 술로 만든 칵테일을 알려드릴게요!!")) {
                        window.history.go(-1);
                    } else {
                        await categoryAll(category);
                    }
                }else{
                    
                    setRecipeList(res);
                }
                
                
            })
        }else{
            await categoryAll(category);
        }
       
        setLoading(false);
    }

    const categoryAll = async (category: string) =>{
        fetch(addr+'/cocktail/categoryCock/'+category,{
            method:"Get",
            headers:{
                "Content-Type":"application/json",
            },
        }).then((res)=>res.json())
        .then(res => {
            setRecipeList(res);
        })
    }

    const allList = async () => {
        setLoading(true);
        setRecipeList([]);
        fetch(addr+'/cocktail',{
            method:"Get",
            headers:{
                "Content-Type":"application/json",
            },
        }).then((res)=>res.json())
        .then((res)=>{
            setRecipeList(res);
        })
        setLoading(false);
    }

    useEffect(() => {
        if(id!==undefined){
            if(id==='all'){
                allList();
            }else{
                const param = id?.split('&');
                
                list(param[0],param[1]);
            }
            
        }else{
            alert('조회 중 에러 발생 \n다시 시도해주세요');
        }
        

    },[])

    const test = () => {
        console.log(recipeList)
    }
    const [search, setSearch] = useState<string>('');
    const [searchData,setSearchData] = useState<Cocktail[]>([])
    const [arrData,setArrData] = useState<Cocktail[]>([])
    const onChange = (e:any) => {
        let category = '';
        
        category = e.target.value;
        
        setLoading(true);
        setArrData([]);
        fetch(addr+'/alcohol/category/'+category,{
            method:'GET',
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json())
        .then((res) => {
            let i:number = 0;
            for (i; i < res.length; i++) {
                const data:Cocktail ={
                    id: res[i].id,
                    name: res[i].name,
                    dosu: res[i].dosu,
                    imgUrl: res[i].imgUrl,
                    only: res[i].only,
                    likeOne: res[i].likeOne
                }
                setArrData(arrData => [...arrData,data]);
                
            }
            
            setLoading(false);
        })
    }

    const onSearch = (e:React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault();
        console.log(search);
        if(search==''){
            allList();
            return;
        }
        const filterData = searchData.filter((row)=>row.name.includes(search));

        setArrData(filterData)
        setSearch('');
    }

    const onChangeSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    return (
        <div id='wrapper2'>
            {/* <div className='search-tool'>
                <select name="selectBoard" id="selectBoard" className="select-search">
                    <option value="A">전체</option>
                    <option value="W">위스키</option>
                    <option value="B">보드카</option>
                    <option value="BR">브랜디</option>
                    <option value="S">전통주</option>
                    <option value="BE">맥주</option>
                    <option value='G'>진</option>
                    <option value='R'>럼</option>
                    <option value="D">데낄라</option>
                    <option value='WI'>와인</option>
                </select>
                <form className='search-form' >
                    <input type="text" id="search"  ></input>
                    <button type='submit' className='btn-submit'>검색</button>
                </form>
            </div> */}
            <AlcoholSearch
                onSearch={onSearch}
                onChange={onChange}
                onChangeSearch = {onChangeSearch}
                />

            <hr></hr>


            {loading ? <strong>loading....</strong>:
                
                <RecipeListco
                    datas={recipeList}/>
            }
            
        </div>
    )
}

export default Recipe;