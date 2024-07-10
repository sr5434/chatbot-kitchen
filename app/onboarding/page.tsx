"use client";
import { useEffect, useState } from 'react';
import { navigate as redirect } from "../actions"
import { completeOnboarding } from './actions';

function Item({ data: data, index: index, deleteObject: deleteObject, setObjectBeingEdited: setObjectBeingEdited }: { data: Product, index: number, deleteObject: Function, setObjectBeingEdited: React.Dispatch<React.SetStateAction<number>> }) {
    return (
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {data.name}
          </th>
          <td className="px-6 py-4">
              {data.desc}
          </td>
          <td className="px-6 py-4">
              {data.ingredients}
          </td>
          <td className="px-6 py-4">
              {data.prepTime} minutes
          </td>
          <td className="px-6 py-4">
              ${data.price}
          </td>
          <td className="px-6 py-4">
          <button type="button" className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async () => {
            setObjectBeingEdited(index);
          }}>Edit</button>
          </td>
          <td className="px-6 py-4">
          <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async () => {
            deleteObject(index);
          }}>Delete</button>
          </td>
      </tr>
    );
  }

export default function Onboarding() {
    const [data, setData] = useState<Product[]>([]);// Product array
    // Business details
    const [businessName, setBusinessName] = useState<string>('');
    const [businessAddress, setBusinessAddress] = useState<string>('');
    const [systemPrompt, setSystemPrompt] = useState<string>('');
    // Details for each individual product
    const [name, setName] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [prepTime, setPrepTime] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [ingredients, setIngredients] = useState<string>('');
    // This is verbose but screw it
    const [nameEdit, setNameEdit] = useState<string>('');
    const [descEdit, setDescEdit] = useState<string>('');
    const [prepTimeEdit, setPrepTimeEdit] = useState<number>(0);
    const [priceEdit, setPriceEdit] = useState<number>(0);
    const [ingredientsEdit, setIngredientsEdit] = useState<string>('');
    // For editing and creating modals
    const [objectBeingEdited, setObjectBeingEdited] = useState<number>(-1);
    const [creatingObject, setCreatingObject] = useState<boolean>(false);

    useEffect(() => {
        if (objectBeingEdited !== -1) {
          const object = data.find(x => data.indexOf(x) == objectBeingEdited);
          setNameEdit(object?.name !== undefined ? object.name : "");
          setDescEdit(object?.desc !== undefined ? object.desc : "");
          setPrepTimeEdit(object?.prepTime !== undefined ? object.prepTime : 0);
          setPriceEdit(object?.price !== undefined ? object.price : 0);
          setIngredientsEdit(object?.ingredients !== undefined ? object.ingredients : "");
        }
    }, [objectBeingEdited]);

    const handleBusinessNameInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setBusinessName(fieldValue);
    }

    const handleBusinessAddressInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setBusinessAddress(fieldValue);
    }

    const handleSystemPromptInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setSystemPrompt(fieldValue);
    }

    const handleNameInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setName(fieldValue);
    }
    const handleDescInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setDesc(fieldValue);
    }
    const handlePrepTimeInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setPrepTime(fieldValue);
    }
    const handlePriceInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setPrice(fieldValue);
    }
    const handleIngredientsInput = async (e: any) => {
        const fieldValue = e.target.value;

        await setIngredients(fieldValue);
    }
    //for editing modal
    const handleNameEdit = async (e: any) => {
        const fieldValue = e.target.value;

        await setNameEdit(fieldValue);
    }
    const handleDescEdit = async (e: any) => {
        const fieldValue = e.target.value;

        await setDescEdit(fieldValue);
    }
    const handlePrepTimeEdit = async (e: any) => {
        const fieldValue = e.target.value;

        await setPrepTimeEdit(fieldValue);
    }
    const handlePriceEdit = async (e: any) => {
        const fieldValue = e.target.value;

        await setPriceEdit(fieldValue);
    }
    const handleIngredientsEdit = async (e: any) => {
        const fieldValue = e.target.value;

        await setIngredientsEdit(fieldValue);
    }

    const flushForms = () => {
        setName('');
        setDesc('');
        setPrepTime(0);
        setPrice(0);
        setIngredients('');
        setNameEdit('');
        setDescEdit('');
        setPrepTimeEdit(0);
        setPriceEdit(0);
        setIngredientsEdit('');
    }

    const submitHandler = async (e: any) => {
        e.preventDefault()
        completeOnboarding({
            "name": businessName,
            "address": businessAddress,
            "systemPrompt": systemPrompt,
            "products": data
        });
      }

    return (
        <div className="App">
            <h1 className='text-3xl font-bold text-center'>Customers</h1>
            <form onSubmit={submitHandler}>
                <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Business Name</label>
                <textarea
                value={businessName}
                onChange={handleBusinessNameInput}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <br />
                <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Business Address</label>
                <textarea
                value={businessAddress}
                onChange={handleBusinessAddressInput}
                placeholder='20 W 34th Street, New York, NY 10001'
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <br />
                <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Special Instructions for Bot</label>
                <textarea
                value={systemPrompt}
                onChange={handleSystemPromptInput}
                placeholder='You are a friendly assistant. We are open Monday through Friday from 9AM to 5PM. We are closed on weekends.'
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <br />

                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ingredients
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Prep time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Edit
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Delete
                            </th>
                        </tr>

                    </thead>
                    <tbody>
                        {data.map((product) => {return <Item key={data.indexOf(product)} data={product} index={data.indexOf(product)} setObjectBeingEdited={setObjectBeingEdited} deleteObject={(id: number) => setData(data.toSpliced(id, 1))}/>})}
                    </tbody>
                    </table>
                    <button 
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setCreatingObject(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" width="16px" height="16px" viewBox="0 0 45.402 45.402" xmlSpace="preserve" className="inverted">
                            <g>
                                <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                            </g>
                        </svg>
                        <p className="ml-3">New Product</p>
                    </button>
                </div>
                <br/>
                <button 
                type="submit"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-lg mb-5"
                >
                Sign Up
                </button>
            </form>
            
            {objectBeingEdited !== -1 ? (
                <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-slate-700">
                        <div className="relative p-6 flex-auto">
                        <form onSubmit={submitHandler}>
                            <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Name</label>
                            <textarea
                                value={nameEdit}
                                onChange={handleNameEdit}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <br />
                            <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Description</label>
                            <textarea
                                value={descEdit}
                                onChange={handleDescEdit}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <br />
                            <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Ingredients</label>
                            <textarea
                                value={ingredientsEdit}
                                onChange={handleIngredientsEdit}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <br />
                            <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Time to prepare(minutes)</label>
                            <input
                                type="number"
                                value={prepTimeEdit}
                                onChange={handlePrepTimeEdit}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <br />
                            <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Price(USD)</label>
                            <input
                                type="number"
                                value={priceEdit}
                                onChange={handlePriceEdit}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <br />
                        </form>
                        </div>
                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            type="button"
                            onClick={() => {
                                setObjectBeingEdited(-1);
                                flushForms();
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            type="button"
                            onClick={() => {
                                const data_copy = [...data];
                                data_copy[objectBeingEdited] = {
                                    "name": nameEdit,
                                    "desc": descEdit,
                                    "prepTime": prepTimeEdit,
                                    "price": priceEdit,
                                    "ingredients": ingredientsEdit
                                };
                                setData(data_copy);
                                setObjectBeingEdited(-1);
                                flushForms();
                            }}
                        >
                            Save Changes
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {creatingObject ? (
                <div>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-slate-700">
                            <div className="relative p-6 flex-auto">
                            <form onSubmit={submitHandler}>
                                <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Name</label>
                                <textarea
                                    value={name}
                                    onChange={handleNameInput}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <br />
                                <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Description</label>
                                <textarea
                                    value={desc}
                                    onChange={handleDescInput}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <br />
                                <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Ingredients</label>
                                <textarea
                                    value={ingredients}
                                    onChange={handleIngredientsInput}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <br />
                                <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Time to prepare(minutes)</label>
                                <input
                                    type="number"
                                    value={prepTime}
                                    onChange={handlePrepTimeInput}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <br />
                                <label className="block mb-2 pt-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Price(USD)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={handlePriceInput}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <br />
                            </form>
                            </div>
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                type="button"
                                onClick={() => {
                                    setCreatingObject(false);
                                    flushForms();
                                }}
                            >
                                Close
                            </button>
                            <button
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                type="button"
                                onClick={() => {
                                    setData([...data, {
                                        "name": name,
                                        "desc": desc,
                                        "prepTime": prepTime,
                                        "price": price,
                                        "ingredients": ingredients
                                    }]);
                                    setCreatingObject(false);
                                    flushForms();
                                }}
                            >
                                Save Changes
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </div>
            ) : null}
        </div>
    )
}