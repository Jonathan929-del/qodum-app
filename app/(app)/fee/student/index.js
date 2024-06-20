// Imports
import axios from 'axios';
import moment from 'moment';
import {router} from 'expo-router';
import 'react-native-get-random-values';
import {WebView} from 'react-native-webview';
import {AuthContext} from '../../../../context/Auth';
import {useState, useEffect, useContext} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {ActivityIndicator, Snackbar, Icon, Card, Switch} from 'react-native-paper';
import {Text, TouchableOpacity, View, ScrollView, Button, Image, Modal, Dimensions, SafeAreaView} from 'react-native';





// Main function
const index = () => {

    // Snack bar actions
    const [visible, setVisible] = useState(false);
    const onDismissSnackBar = () => setVisible(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    // User
    const {user, school} = useContext(AuthContext);


    // Selected tab
    const [selectedTab, setSelectedTab] = useState('pay');


    // Is show heads
    const [isShowHeads, setIsShowHeads] = useState(false);


    // Is all fee types
    const [isAllFeeTypes, setIsAllFeeTypes] = useState(true);


    // Is all installments paid
    const [isAllInstallmentsPaid, setIsAllInstallmentsPaid] = useState(false);


    // Last payment date
    const [lastPaymentDate, setLastPaymentDate] = useState(new Date());


    // Installment due on date
    const [installmentDueOnDate, setInstallmentDueOnDate] = useState('');


    // States
    const [states, setStates] = useState({
        loading:false,
        loadingData:false
    });


    // Opened dropdown
    const [openedField, setOpenedField] = useState('');


    // Fee details
    const [feeDetails, setFeeDetails] = useState();


    // Payment URL
    const [paymentUrl, setPaymentUrl] = useState('');


    // Fee amounts
    const [totalFee, setTotalFee] = useState(0);
    const [receivedFee, setReceivedFee] = useState(0);
    const [dueFee, setDueFee] = useState(0);
    const [previewHeads, setPreviewHeads] = useState([]);


    // Values
    const [selectedInstallment, setSelectedInstallment] = useState({label:'', value:''});
    const [feeTypes, setFeeTypes] = useState([]);
    const [selectedFeeType, setSelectedFeeType] = useState({label:'', value:''});


    // Handle webview navigation
    const handleNavigationChange = navState => {
        const {url} = navState;
        // Handle navigation changes such as pop-ups or redirects here
        if (url.includes('otp-confirmation')) {
          // Example of handling OTP confirmation
          Alert.alert('OTP Confirmation', 'Handling OTP confirmation here.');
        }
        if(navState.url.split('/')[4] === 'furl'){
            setPaymentUrl('');
            setSnackbarMessage('Payment Failed, Please Try Again.');
            setVisible(true);
        }else if(navState.url.split('/')[4] === 'surl'){
            submitHandler();
            setPaymentUrl('');
            setSnackbarMessage('Paid Successfully!');
            setVisible(true);
        }else if(navState.url.includes('otp-page-url')){
            setWebViewUrl(navState.url);
        }
    };


    // Fetch data
    const fetchData = async () => {

        // Setting loading data to true
        setStates({...states, loadingData:true});

        // Installments response
        const installmentsLink = `${process.env.EXPO_PUBLIC_API_URL}/installments/names`;
        const installmentsRes = await axios.get(installmentsLink);
        const installmentsDropdownData = installmentsRes.data.map(s => {
            return{
                label:s.name,
                value:s.name.toLowerCase(),
                due_on_date:s.due_on_date
            };
        });


        // Fee details response
        const feeDetailsLink = `${process.env.EXPO_PUBLIC_API_URL}/students/student/fee`;
        const feeDetailsRes = await axios.post(feeDetailsLink, {adm_no:user.adm_no});
        setFeeDetails(feeDetailsRes.data);


        // Fee last date response
        const lastDateLink = `${process.env.EXPO_PUBLIC_API_URL}/payments/payment/last-payment`;
        const lastDateRes = await axios.post(lastDateLink, {adm_no:user.adm_no});
        setLastPaymentDate(lastDateRes.data);
        
        
        // Setting selected installment
        const installmentsWithValues = installmentsDropdownData.filter(i => totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === i.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === i.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value) !== 0)))));
        if(installmentsWithValues.length === 0){
            setIsAllInstallmentsPaid(true);
            setStates({...states, loadingData:false});
            return;
        }else{

            const selectedFilteredInstallment = installmentsWithValues[0];
            setSelectedInstallment(selectedFilteredInstallment);
            setInstallmentDueOnDate(`${selectedFilteredInstallment.due_on_date.day} ${selectedFilteredInstallment.due_on_date.month}`);
            setTotalFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.value))))));
            setReceivedFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.last_rec_amount || 0))))));
            setDueFee(totalNumberGenerator(feeDetailsRes.data?.heads?.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments'))?.map(h => totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedFilteredInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value))))));
    
    
            // Setting heads
            setPreviewHeads(feeDetailsRes.data.heads.filter(h => h?.amounts && (h.installment === selectedFilteredInstallment.label || h.installment === 'All installments')));
    
    
            // Setting fee types
            const feeTypesDropdownData = feeDetailsRes.data.heads?.map(h => h.type_name).filter((type, index, self) => self.indexOf(type) === index).map(t => {
                return{
                    label:t,
                    value:t.toLowerCase()
                };
            });
            setFeeTypes(feeTypesDropdownData);
        };


        // Setting loading to false
        setStates({...states, loadingData:false});

    };


    // Total number generator
    const totalNumberGenerator = numbers => {
        return numbers.reduce((acc, curr) => acc + curr, 0);
    };


    // Button click
    const buttonClick = async () => {
        try {

            // Setting is loading to true
            setStates({...states, loading:true});


            // Easy collect api
            const easyCollectLink = `${process.env.EXPO_PUBLIC_API_URL}/payments/payment/easy-collect`;
            const easyCollectParams = {
                merchant_txn:Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                name:user.student.name.trim(),
                email:user.student.email,
                phone:user.student.mobile || '0123456789',
                amount:dueFee,
                message:`${selectedInstallment.label} Payment`
            };
            const easyCollectRes = await axios.post(easyCollectLink, easyCollectParams);
            setPaymentUrl(easyCollectRes.data);


            // Setting is loading to false
            setStates({...states, loading:false});

        }catch(err){
            console.log(err);
        };
    };


    // Submit handler
    const submitHandler = async () => {
        setStates({...states, loading:true});
        try {

            // Creating new fee heads
            const unChangedHeads = feeDetails?.heads?.filter(h => !previewHeads.map(ph => ph.head_name).includes(h.head_name));
            const changedHeads = feeDetails?.heads?.filter(h => previewHeads.map(ph => ph.head_name).includes(h.head_name)).map(h => {
                return{
                    ...h,
                    amounts:h.amounts.filter(a => selectedInstallment.label === a.name).map(a => {
                        return{
                            name:a.name,
                            value:Number(a.value),
                            conc_amount:Number(a.conc_amount || 0),
                            paid_amount:0,
                            payable_amount:0,
                            last_rec_amount:Number(a.value) - Number(a.conc_amount || 0)
                        }
                    }).concat(h.amounts.filter(a => selectedInstallment.label !== a.name))
                }
            });
            const newHeads = [...unChangedHeads, ...changedHeads];
            const orderedNewHeads = newHeads.sort((a, b) => feeDetails?.heads?.findIndex(o => o.head_name === a.head_name) - feeDetails?.heads?.findIndex(o => o.head_name === b.head_name));

            // Updating student fee heads
            const headsLink = `${process.env.EXPO_PUBLIC_API_URL}/students/student/fee/pay`;
            await axios.post(headsLink, {adm_no:user.adm_no, new_heads:orderedNewHeads});


            // Creating payment
            const paymentHeads = feeDetails?.heads?.filter(h => previewHeads.map(ph => ph.head_name).includes(h.head_name)).map(h => {
                return{
                    ...h,
                    amounts:h.amounts.filter(a => selectedInstallment.label === a.name).map(a => {
                        return{
                            name:a.name,
                            value:Number(a.value),
                            conc_amount:Number(a.conc_amount || 0),
                            paid_amount:Number(a.value) - (Number(a.last_rec_amount || 0) + Number(a.conc_amount || 0)),
                            payable_amount:Number(a.value) - (Number(a.last_rec_amount || 0) + Number(a.conc_amount || 0)),
                            last_rec_amount:Number(a.last_rec_amount || 0)
                        }
                    })
                }
            });
            const paymentLink = `${process.env.EXPO_PUBLIC_API_URL}/payments/payment/create`;
            const params = {
                // School data
                school_name:school?.school_name || '',
                receipt_no:Math.floor(100000 + Math.random() * 900000),
                school_address:school?.school_address || '',
                website:school?.website || '',
                school_no:school?.school_no || '',
                affiliation_no:school?.affiliation_no || '',
                logo:school?.logo || '',
    
                // Student data
                student:user?.student?.name,
                class_name:user?.student?.class_name || '',
                adm_no:user?.adm_no || '',
                father_name:user?.parents?.father?.father_name || '',
                is_new:user?.student?.is_new || false,
                is_active:user?.student?.is_active || false,
                student_status:user?.student?.student_status || '',
    
                // Payment data
                installments:selectedInstallment.label,
                received_date:new Date(),
                fee_type:'All fee types',
                bank_name:'',
                fee_group:feeDetails.group_name,
                actual_amount:totalFee,
                paid_amount:dueFee,
                paid_heads:paymentHeads

            };
            await axios.post(paymentLink, params);


            // Reseting
            setVisible(true);
            setStates({...states, loading:false});
            fetchData();
    
        }catch(err){
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={{height:'100%', alignItems:'center', gap:30}}>
            <View style={{width:'100%', height:120, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                    >
                        <Icon source='chevron-left' size={40} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Fee</Text>
                </View>
            </View>


            {/* Payment modal */}
            <Modal visible={paymentUrl !== ''}>
                <View style={{width:'100%', height:Dimensions.get('screen').height/7.5, display:'flex', flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:10, paddingBottom:30, backgroundColor:'#0094DA', borderBottomRightRadius:40, borderBottomLeftRadius:40}}>
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:20}}>
                        <TouchableOpacity
                            onPress={() => setPaymentUrl('')}
                        >
                            <Icon source='chevron-left' size={40} color='#fff'/>
                        </TouchableOpacity>
                        <Text style={{textAlign:'center', fontSize:18, color:'#fff', fontWeight:'900'}}>Pay Fee</Text>
                    </View>
                </View>

                <View style={{flex:1, alignItems:'center', marginVertical:10}}>
                    <SafeAreaView style={{flex:1, width:'90%'}}>
                        <WebView
                            source={{uri:paymentUrl}}
                            onNavigationStateChange={handleNavigationChange}
                            style={{height:Dimensions.get('screen').height/9.5, width:'100%'}}
                        />
                    </SafeAreaView>
                </View>
            </Modal>


            {/* Tabs */}
            <View style={{width:'80%', display:'flex', flexDirection:'row', borderRadius:100, backgroundColor:'#F5F5F8'}}>
                <TouchableOpacity
                    onPress={() => setSelectedTab('pay')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'pay' ? '#fff' : 'gray', backgroundColor:selectedTab === 'pay' ? '#3C5EAB' : '#F5F5F8'}}>Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedTab('receipt');
                    }}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'receipt' ? '#fff' : 'gray', backgroundColor:selectedTab === 'receipt' ? '#3C5EAB' : '#F5F5F8'}}>Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedTab('book')}
                    style={{flex:1}}
                >
                    <Text style={{paddingVertical:10, fontWeight:'800', textAlign:'center', borderRadius:100, color:selectedTab === 'book' ? '#fff' : 'gray', backgroundColor:selectedTab === 'book' ? '#3C5EAB' : '#F5F5F8'}}>Book</Text>
                </TouchableOpacity>
            </View>


            {/* Form */}
            <ScrollView style={{width:'100%'}} contentContainerStyle={{alignItems:'center'}}>
                <View style={{width:'90%', gap:20, paddingBottom:50}}>
                    {isAllInstallmentsPaid ? (
                        <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8}}>
                            <Image
                                style={{width:25, height:25}}
                                source={require('../../../../assets/Fee/Success.png')}
                            />
                            <Text style={{color:'#28a745', fontSize:20}}>All Paid!</Text>
                        </View>
                    ) : states.loadingData ? (
                        <ActivityIndicator />
                    ) : (
                        <>

                            {/* Card */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'column', gap:6, paddingVertical:10, paddingHorizontal:20}}>

                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:8}}>

                                        {user.student.image ? (
                                            <Image
                                                source={{uri:user.student.image}}
                                                style={{height:70, width:70, borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}
                                            />
                                        ) : (
                                            <View style={{width:70, height:70, alignItems:'center', justifyContent:'center', borderRadius:4, borderWidth:1, borderColor:'#3C5EAB'}}>
                                                <Text style={{fontWeight:'700', fontSize:11}}>No Image</Text>
                                            </View>
                                        )}

                                        <View style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                            <Text style={{fontSize:16, fontWeight:'600'}}>{user.student.name}</Text>
                                            <Text style={{fontSize:12, color:'gray'}}>{user.adm_no}</Text>
                                            <Text style={{fontSize:12, color:'gray'}}>Class - {user.student.class_name}</Text>
                                        </View>

                                    </View>

                                    <View style={{display:'flex', flexDirection:'column', gap:2}}>

                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:6}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Total Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{totalFee}</Text>
                                            </View>


                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Received Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{receivedFee}</Text>
                                            </View>
                                        </View>

                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Due Fee:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>₹{dueFee}</Text>
                                            </View>

                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Text style={{fontSize:12, color:'#0094DA', marginLeft:2}}>Last Received On:</Text>
                                                <Text style={{fontSize:12, marginLeft:2, color:'gray'}}>{lastPaymentDate === 'No payments' ? '-' : moment(lastPaymentDate).format('D-M-YYYY')}</Text>
                                            </View>
                                        </View>

                                    </View>

                                </View>
                            </Card>


                            {/* Outstanding fee */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:6, paddingVertical:10, paddingHorizontal:20}}>

                                    <Text style={{fontSize:30, fontWeight:'900'}}>₹{dueFee}</Text>
                                    <Text style={{fontSize:12, color:'gray'}}>Total Outstanding Fee For {selectedInstallment.label}</Text>

                                </View>
                            </Card>


                            {/* Button */}
                            {states.loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Button
                                    onPress={buttonClick}
                                    title='Pay Now'
                                />
                            )}


                            {/* Show details */}
                            <Card>
                                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:6, paddingVertical:10, paddingHorizontal:20}}>

                                    <View style={{flex:1, display:'flex', flexDirection:'column'}}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:4}}>
                                            <Switch
                                                onChange={() => setIsAllFeeTypes(!isAllFeeTypes)}
                                                value={isAllFeeTypes}
                                            />
                                            <Text>All Fee Types</Text>
                                        </View>

                                        <Text style={{color:'#0094DA', fontWeight:'600'}}>Due on {installmentDueOnDate}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{paddingHorizontal:6, paddingVertical:2, borderRadius:4, backgroundColor:'#0094DA'}}
                                        onPress={() => setIsShowHeads(!isShowHeads)}
                                    >
                                        <Text style={{fontSize:12, color:'#fff'}}>
                                            {isShowHeads ? 'Hide' : 'Show'} Details
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </Card>


                            {/* Fee Type */}
                            {!isAllFeeTypes && (
                                <View style={{gap:6}}>
                                    <Text>Fee Type</Text>
                                    <Dropdown
                                        placeholderStyle={{color:'gray', paddingLeft:10}}
                                        selectedTextStyle={{paddingLeft:10}}
                                        data={feeTypes}
                                        search
                                        activeColor='#ccc'
                                        labelField='label'
                                        valueField='value'
                                        placeholder='Select Fee Type'
                                        searchPlaceholder='Search...'
                                        value={selectedFeeType}
                                        onFocus={() => setOpenedField('fee-type')}
                                        onBlur={() => setOpenedField('')}
                                        onChange={item => setSelectedFeeType(item)}
                                        style={{backgroundColor:'#F5F5F8', height:60, paddingHorizontal:20, borderTopLeftRadius:5, borderTopRightRadius:5, borderBottomWidth:openedField === 'fee-type' ? 2 : 1, borderBottomColor:openedField === 'fee-type' ? '#0094DA' : 'gray'}}
                                        renderLeftIcon={() => (
                                            <Icon source='book-edit' color='gray' size={25}/>
                                        )}
                                    />
                                </View>
                            )}


                            {/* Heads */}
                            {isShowHeads && (
                                <View style={{display:'flex', flexDirection:'column', borderRadius:4, borderWidth:1, borderColor:'#ccc'}}>
                                    <View style={{display:'flex', flexDirection:'row', backgroundColor:'#3C5EAB', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:1, borderBottomColor:'#ccc'}}>
                                        <Text style={{flex:1, textAlign:'center', color:'#fff', fontWeight:'600', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>Fee Head</Text>
                                        <Text style={{flex:1, textAlign:'center', paddingVertical:4, color:'#fff', fontWeight:'600'}}>Amount</Text>
                                    </View>
                                    {previewHeads.map(h => (
                                        <View
                                            key={h.head_name}
                                            style={{display:'flex', flexDirection:'row', borderTopLeftRadius:4, borderTopRightRadius:4, borderBottomWidth:previewHeads.indexOf(h) !== previewHeads.length - 1 ? 1 : 0, borderBottomColor:'#ccc'}}
                                        >
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4, borderRightWidth:1, borderRightColor:'#ccc'}}>{h.head_name}</Text>
                                            <Text style={{flex:1, textAlign:'center', paddingVertical:4}}>₹{
                                                totalNumberGenerator(h?.amounts?.filter(a => a.name === selectedInstallment.label)?.map(a => Number(a.last_rec_amount === a.value ? 0 : a.payable_amount || a.value)))
                                            }</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                        </>
                    )}
                </View>
            </ScrollView>



            {/* Snackbar */}
            <Snackbar
                style={{backgroundColor:snackbarMessage === 'Paid Successfully' ? 'green' : 'red'}}
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: <Icon source='close' color='#fff' size={20}/>,
                    onPress:() => setVisible(false)
                }}
            >
                {snackbarMessage}
            </Snackbar>

        </View>
    );
};





// Export
export default index;