import { useEffect, useState } from 'react';
import { setCookie, getCookie } from '../Common/Cookies';
import '../css/App.css';
import '../css/Login.css';
import { recommand } from '../interface/recommand';
import { addr } from '../Common/serverAddr';
import { Grid } from '@mui/material';
import { gridSpacing } from '../store/constant';
import TodayAlchoCard from './TodayAlchoCard';
import InfoCard from './InfoCard';
import RecommandCard from './RecommandCard';
import PopularCard from './PopularCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';

function Main() {

    const [isLoading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TodayAlchoCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={6} md={6} lg={12}>
                                <InfoCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={6} md={6} lg={12}>
                                <RecommandCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        {/* <TotalGrowthBarChart isLoading={isLoading} /> */}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

}

export default Main;


/*

????????? ???

3. ???????????? ?????? ??????

6. ?????? ???????????? + ??????????????? ?????? ????????? ??? ?????? (???????????? 2)

9. ??? ?????? ?????? ?????? ????????????

10. ????????? ?????? ?????? + (+)????????? ?????? ?????????

*/