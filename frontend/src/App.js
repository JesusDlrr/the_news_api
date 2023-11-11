import './App.css';
import { CardDefault } from './components/CardDefault';
import { Input } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faKey } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from "jwt-decode";
import Countdown from "react-countdown";
import axios from 'axios';
import { Option, Select, Chip, Button, Navbar, Typography } from '@material-tailwind/react';
import countries from './countries';

function App() {
  const [news, setNews] = useState([]);
  const [country_filter, setCountryFilter] = useState([]);
  const [search_title, setSearchTitle] = useState("");
  const [key_copied, setKeyCopied] = useState(false);
  const [guest_key, setGuestKey] = useState(null);
  const [key_expiration, setKeyExpiration] = useState(null);

  const getAPIKey = async () => {
    if (guest_key == null) {
      axios.post("http://localhost:3001/auth/key").then((res) => {
        if (res.data) {
          setGuestKey(res.data);
          const cookies = new Cookies();
          const { exp } = jwtDecode(res.data);

          setKeyExpiration(exp * 1000);
          cookies.set('guest_key', res.data, {
            path: '/',
            expires: new Date(exp * 1000)
          });
        }
      });
    }
    navigator.clipboard.writeText(guest_key);
    setKeyCopied(true);
    setTimeout(() => {
      setKeyCopied(false);
    }, 4000)
  }
  const getLatestNews = async () => {
    axios.get("http://localhost:3001/news/latest").then((res) => {
      setNews(res.data);
      if (Math.random() < 0.5) {
        setNews([...news, {
          title: "Have you seen this person?",
          article: "",
          author: "",
          country: "",
          topic: "",
          city: "",
          date: new Date(0),
          image: "https://thispersondoesnotexist.com/"
        }])
      }
    })
  }

  useEffect(() => {
    if (search_title === "" && country_filter.size === 0) {
      getLatestNews();
    } else {
      axios.get(`http://localhost:3001/news?title=${search_title}&country=${country_filter.join(",")}`, {
        headers: {
          Authorization: "c3R1cGlkIGZsdSBwcmVzc2VkIG15IGVhcmRydW1zIGludG8gbXkgc2t1bGwgc28gbm93IEkgZ290dGEgdGFrZSBzdGVyb2lkcyB0byBoZWFyIHlvdXIgYnVsbHNoaXQgYWdhaW4uIGdvb2RuaWdodCBmYW0="
        }
      }).then((res) => {
        setNews(res.data)
      })
    }
  }, [search_title, country_filter])

  useEffect(() => {
    getLatestNews()
    const cookies = new Cookies();
    const key = cookies.get("guest_key");
    if (key) {
      const { exp } = jwtDecode(key);
      setGuestKey(key);
      setKeyExpiration(exp * 1000)
    }
  }, []);

  return (
    <div className="bg-cover bg-center w-full h-96">
      <Navbar className="sticky border-none top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography as="a" href="#" className="mr-4 cursor-pointer py-1.5 font-medium">
            The News API
          </Typography>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{ }</div>
            <div className="flex items-center gap-x-1">
              <div className="text-center">

                <Button className="flex items-center gap-3" color="black" onClick={getAPIKey} variant="outlined">
                  {
                    key_copied ?
                      "key copied to clipboard!"
                      :
                      guest_key ?
                        <>
                          Copy your API Key
                        </>
                        :
                        <>
                          Get your API key <FontAwesomeIcon color="black" icon={faKey} />
                        </>
                  }
                </Button>
                {
                  guest_key && <p className="text-sm">
                    expires in <Countdown date={key_expiration} daysInHours={true} onComplete={() => {
                      setKeyExpiration(null);
                      setGuestKey(null);
                    }} />
                  </p>
                }
              </div>
            </div>
          </div>
        </div>
      </Navbar >
      <div className="bg-black pt-5 pb-5 grid justify-items-center content-center">
        <h1 className="text-center text-white text-7xl">THE NEWS API</h1>
        <p className="text-center text-white text-lg mt-2">THE BEST OF THE NEWS ONLY</p>
        <p className="text-center text-white text-xs mb-16 mt-2">TOTALLY NOT FAKE</p>
        <div className="w-1/2">
          <input placeholder="Search title" className="rounded-full peer py-3 px-5 w-full border-transparent border-blue-gray-200 px-3 font-normal outline outline-0 transition-all focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" value={search_title} onChange={(e) => { setSearchTitle(e.target.value) }} icon={<FontAwesomeIcon color="white" icon={faSearch} />} />
        </div>
        <div className="w-1/2 mt-10">
          <Select
            onChange={(e) => { country_filter.indexOf(e) === -1 && setCountryFilter([...country_filter, e]) }}
            labelProps={{
              className: "text-white"
            }}
            color="yellow"
            label="Add a country to filter"
            variant="standard"
            menuProps={{ className: "h-48" }}
          >
            {countries.map(({ name, flags }) => (
              <Option key={name} value={name}>
                <div className="flex items-center gap-x-2">
                  <img
                    src={flags.svg}
                    alt={name}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  {name}
                </div>
              </Option>
            ))}
          </Select>
          {/* <Input color="white" placeholder="Location" variant="static" /> */}
          <div className="flex gap-x-3 gap-y-2 flex-wrap mt-10 w-full">
            {
              country_filter.map((country) => (
                <Chip color="yellow" className="rounded-full" variant="outlined" onClose={() => { setCountryFilter(country_filter.filter((e) => (e !== country))) }} value={country} />
              ))
            }
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 p-5 justify-items-center">
        {
          news.map((_new) => (
            <CardDefault _new={_new} />
          ))
        }

      </div>
    </div >
  );
}

export default App;
