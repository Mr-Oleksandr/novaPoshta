import React, {useCallback} from 'react'
import Select, { createFilter }  from 'react-select'
import './App.css';
import {useEffect, useMemo, useState} from "react";
import TextInput from 'react-autocomplete-input';
import {novaPoshtaAPI} from "./API";
import {useForm} from "react-hook-form";
import SelectedCity from "./SelectedCity";

function App() {

    const [offices, setOffices] = useState({
        data: [],
        loading: true,
        error: null,
    });
    console.log(offices)
    const [selectedCity, setSelectedCity] = useState({
        id:'',
        name:''
    });

    const [recipientOffices, setRecipientOffices] = useState({
        data: [],
        loading: true,
        error: null,
    });
    const [selectedRecipientCity, setSelectedRecipientCity] = useState({
        id:'',
        name:''
    });

    const [refSender, setRefSender] = useState('')

    const [inputs, setInputs] = useState({
        description:'',
        price:'',
        weight:'',
        payerType:'Recipient',
        paymentMethod:'Cash',
        dateTime:'',
        cargoType:'Одяг',
        sender:'',
        citySender:'',
        senderAddress:'',
        recipientsPhone:'',
        recipientName:'',
        recipientSurname:'',
        recipientFullName:'',
        recipientCityName:''
    })

    const {
        register, handleSubmit, setValue, control, watch, getValues, errors
    } = useForm({
        defaultValues:{
            description:'',
            price:'',
            weight:'',
            payer:'Recipient',
            paymentMethod:'Cash',
            dateTime:'',
            cargoType:'Одяг',
            sender:'',
            citySender:'',
            senderAddress:'',
            recipientsPhone:'',
            recipientName:'',
            recipientSurname:'',
            recipientFullName:'',
            recipientCityName:'',
            recipientAddress:'',
        }
    });

    const onSubmit = (v) => {
        novaPoshtaAPI.post('', {
            modelName: "InternetDocument",
            calledMethod: "save",
            methodProperties: {
                PayerType: 'Recipient',
                PaymentMethod: 'Cash',
                DateTime: `${new Date().getDate()}.0${new Date().getMonth()}.${new Date().getFullYear()}`,
                CargoType: "Cargo",
                Weight: v.weight,
                ServiceType: "WarehouseWarehouse",
                SeatsAmount: "2",
                Description: v.description,
                Cost: v.price,
                CitySender: v.citySender.value,
                Sender: refSender,
                SenderAddress: v.senderAddress,
                ContactSender: refSender,
                SendersPhone: "380660123123",
                RecipientCityName: v.recipientCityName.label,
                RecipientAddress: v.recipientAddress.value,
                RecipientName: `${v.recipientName} ${v.recipientSurname} ${v.recipientFullName}`,
                RecipientsPhone: v.recipientsPhone,
                RecipientType: "PrivatePerson",
                EDRPOU: "12345678"
            }
        })
        console.log( v.recipientAddress.value,)
    }

    const handleChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setInputs(prevValue => ({...prevValue, [id]: value}))
    }


    const handleRecipientCitySelect = (city) => {
        setSelectedRecipientCity(city);
        setValue('recipientCityName',city)
    };




    useEffect(() => {
        novaPoshtaAPI.post('', {
            modelName: "Counterparty",
            calledMethod: "getCounterparties",
            methodProperties: {
                CounterpartyProperty: "Sender"
            }
        })
            .then(({data : {data}}) => {
                setRefSender(data[0].Ref)
            })
    }, [])

    useEffect(() => {
        if (watch('recipientCityName')) {
            novaPoshtaAPI.post('', {
                modelName: 'AddressGeneral',
                calledMethod: 'getWarehouses',
                methodProperties: {
                    CityName: watch('recipientCityName').label,
                },
            })
                .then(({ data: { data } }) => setRecipientOffices({
                    data,
                    error: null,
                    loading: false,
                }))
                .catch((e) => {
                    setRecipientOffices({
                        data: [],
                        error: e,
                        loading: false,
                    });
                });
        }
    }, [watch('recipientCityName')?.value]);

    useEffect(() => {
        if (watch('citySender')) {
            novaPoshtaAPI.post('', {
                modelName: 'AddressGeneral',
                calledMethod: 'getWarehouses',
                methodProperties: {
                    CityName: watch('citySender').label,
                },
            })
                .then(({ data: { data } }) => setOffices({
                    data,
                    error: null,
                    loading: false,
                }))
                .catch((e) => {
                    setOffices({
                        data: [],
                        error: e,
                        loading: false,
                    });
                });
        }
    }, [watch('citySender')?.value]);
    console.log(errors)
    console.log(recipientOffices)



  return (
    <div className="App">
           <div className="container">
               <form onSubmit={handleSubmit(onSubmit)}>
                   <div className="form-row">
                       <div className="form-group col-md-6">
                           <label htmlFor="description">Опис відправлення</label>
                           <input name="description"
                                  ref={register({ required: 'Error' })}
                                  onChange={handleChange}
                                  value={inputs.description}
                                  type="text"
                                  className="form-control"
                                  id="description"
                                  placeholder="Опис відправлення"/>
                       </div>
                       <div className="form-group col-md-6">
                           <label htmlFor="price">Оголошена вартість</label>
                           <input
                               onChange={handleChange}
                               ref={register({ required: 'Error' })}
                               value={inputs.price}
                               type="text"
                               className="form-control"
                               name="price"
                               id="price"
                               placeholder="Оголошена вартість"/>
                       </div>
                   </div>
                   <div className="form-group">
                       <label htmlFor="weight">Загальна вага</label>
                       <input onChange={handleChange}
                              value={inputs.weight}
                              ref={register({ required: 'Error' })}
                              type="text" className="form-control"
                              name="weight"
                              id="weight"
                              placeholder="Загальна вага"/>
                   </div>
                   <div className="form-group">
                       <label htmlFor="disabledTextInput">Відправник</label>
                       <input
                           onChange={handleChange}
                           ref={register({ required: 'Error' })}
                           type="text"
                              id="sender"
                              name="sender"
                              className="form-control"
                              value="Ковальов Олександр Вікторович +380 (96) 492-63-30"
                              />
                   </div>
                   <div className="form-row">

                       <div className="form-group col-md-6">
                           <label htmlFor="citySender">Населений пункт</label>
                           <SelectedCity name="citySender" control={control}/>
                       </div>
                       <div className="form-group col-md-4">
                           <label htmlFor="inputState">Відділення</label>
                           <select name='senderAddress'
                                   ref={register({required:'asd'})}
                                   id="senderAddress"
                                   className="form-control" >
                               <option selected>Відділення</option>
                               {offices.data.map(({ Description, Ref }) => (
                                   <option  value={Ref}>
                                       {Description}
                                   </option>
                               ))}
                           </select>
                       </div>
                   </div>
                   <div className="form-group">
                       <label htmlFor="disabledTextInput">Одержувач</label>
                       <div className="form-row">
                           <div className="form-group col-md-6">
                               <label htmlFor="recipientsPhone">Номер телефону</label>
                               <input onChange={handleChange}
                                      ref={register({ required: 'Error' })}
                                      name='recipientsPhone'
                                      type="text"
                                      className="form-control"
                                      id="recipientsPhone"
                                      placeholder="Номер телефону"/>
                           </div>
                           <div className="form-group col-md-6">
                               <label htmlFor="recipientSurname">Прізвище</label>
                               <input onChange={handleChange}
                                      ref={register({ required: 'Error' })}
                                      type="text"
                                      className="form-control"
                                      id="recipientSurname"
                                      name="recipientSurname"
                                      placeholder="Прізвище"/>
                           </div>
                           <div className="form-group col-md-6">
                               <label htmlFor="recipientName">Імя</label>
                               <input onChange={handleChange}
                                      ref={register({ required: 'Error' })}
                                      type="text"
                                      className="form-control"
                                      id="recipientName"
                                      name="recipientName"
                                      placeholder="Імя"/>
                           </div>
                           <div className="form-group col-md-6">
                               <label htmlFor="recipientFullName">По батькові</label>
                               <input onChange={handleChange}
                                      type="text"
                                      className="form-control"
                                      id="recipientFullName"
                                      name="recipientFullName"
                                      placeholder="По батькові"/>
                           </div>
                       </div>
                   </div>
                   <div className="form-row">

                       <div className="form-group col-md-6">
                           <label htmlFor="recipientCityName">Населений пункт</label>
                           <SelectedCity name="recipientCityName" control={control}/>
                       </div>
                       <div className="form-group col-md-4">
                           <label htmlFor="recipientAddressName">Відділення</label>
                           <select className="form-control"
                                   ref={register({required:'asd'})} name='recipientAddress'>
                               <option selected>Відділення</option>
                               {recipientOffices.data.map(({ Description, Ref }) => (
                                   <option value={Ref}>
                                       {Description}
                                   </option>
                               ))}
                           </select>
                       </div>
                   </div>
                   <button type="submit" className="btn btn-primary">Створити накладну</button>
               </form>
           </div>
    </div>
  );
}

export default App;
