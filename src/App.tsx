import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Config from "./config.json";
import Tokyo_Bunkyo from "./result/Tokyo_Bunkyo.json";
import Tokyo_Chiyoda from "./result/Tokyo_Chiyoda.json";
import Tokyo_Nerima from "./result/Tokyo_Nerima.json";
import Univ_Air from "./result/Univ_Air.json";
import Nagano_Azumino from "./result/Nagano_Azumino.json";
import Nagano_Matsumoto from "./result/Nagano_Matsumoto.json";
import should_buy from "./result/should_buy.json";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

interface Book {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    release_date: string | null;
    pages: number | string | null;
    price: string;
    reserve_url: string;
    image_url: string | null;
}
type LibraryTable = {
  [key: string]: Book[];
};
const libraries_table: LibraryTable = {
    'Tokyo_Bunkyo': Tokyo_Bunkyo,
    'Tokyo_Chiyoda': Tokyo_Chiyoda,
    'Tokyo_Nerima': Tokyo_Nerima,
    'Univ_Air': Univ_Air,
    'Nagano_Azumino': Nagano_Azumino,
    'Nagano_Matsumoto': Nagano_Matsumoto,
    'should_buy': should_buy,
}

function External(p: {url: string; txt: string;}) {
  return <a href={p.url} target="_blank" rel="noreferrer">{p.txt}</a>;
}

function LinkButton(p: {url: string; txt: string;}) {
    return <Button href={p.url} target="_blank" rel="noreferrer">{p.txt}</Button>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>Book shelf: <External url={`https://booklog.jp/users/${Config.booklog_id}`} txt={Config.booklog_id} /></li>
            <li>
              Library List
              <ul>
                {
                  Config.libraries.map(l => (
                    <li><Link to={`/book-list/${l}`}>{l}</Link></li>
                  ))
                }
                <li><Link to="/book-list/should_buy">Should buy</Link></li>
              </ul>
            </li>
          </ul>
        </nav>

        <Switch>
          {Config.libraries.concat('should_buy').map(l => (
            <Route path={`/book-list/${l}`}>
              <h1>Book List: {l} ({libraries_table[l].length} books)</h1>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Pages</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {libraries_table[l].map(b => (
                    <TableRow>
                      <TableCell>
                        {b.image_url &&
                         <a href={`https://booklog.jp/item/1/${b.isbn}`} target="_blank" rel="noreferrer">
                           <img alt={b.title} src={b.image_url} height="100" />
                         </a>
                        }
                      </TableCell>
                      <TableCell><External url={`https://booklog.jp/item/1/${b.isbn}`} txt={b.title} /></TableCell>
                      <TableCell><External url={`https://booklog.jp/author/${encodeURI(b.author)}`} txt={b.author} /></TableCell>
                      <TableCell>{b.pages}</TableCell>
                      <TableCell>
                        <ButtonGroup color="primary" variant="contained">
                          <LinkButton url={`https://calil.jp/book/${b.isbn}`} txt="Calil" />
                          {(l !== "should_buy") ? (
                            <LinkButton url={b.reserve_url} txt="Reserve" />
                          ) : (
                            <div>
                              <LinkButton url={`https://www.e-hon.ne.jp/bec/SA/Forward?spKeyword=${b.isbn}&button=btnSpeed&mode=kodawari_header&ctlB9Flg=1`} txt="e-hon" />
                              <LinkButton url={`https://amazon.co.jp/dp/${b.isbn}`} txt="Amazon" />
                            </div>
                          )}
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Route>
          ))
          }
        </Switch>
      </div>
    </Router>
  );
}

export default App;
