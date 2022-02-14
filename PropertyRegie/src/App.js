import React, { Component } from "react";
import logo_white from "../images/logo_white.png"; //making connection with IMAGE folder
import { dataPPR } from "./dataPPR.js";

const localdataPPR = dataPPR;
const sortAny = "All";
const sortSelect = "Select...";
const sortYearAsc = "Year Ascending";
const sortYearDesc = "Year Descending";
const sortPriceAsc = "Price Ascending";
const sortPriceDesc = "Price Descending";
const sortCountyAZ = "County A-Z";
const sortCountyZA = "County Z-A";

function getTotalPrice(acc, obj) {
  return acc + obj.Price;
}

class App extends Component {
  constructor(props) {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    super(props);
    //---------- Here we're binding our event handler methods to this component ----------
    this.onAddressFormChange = this.onAddressFormChange.bind(this);
    this.handleCountyChange = this.handleCountyChange.bind(this);
    this.handleYearMinChange = this.handleYearMinChange.bind(this);
    this.handleYearMaxChange = this.handleYearMaxChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.handlePriceMinChange = this.handlePriceMinChange.bind(this);
    this.handlePriceMaxChange = this.handlePriceMaxChange.bind(this);
    this.doFilterProperty = this.doFilterProperty.bind(this);
    this.calculateAveragePrice = this.calculateAveragePrice.bind(this);
    this.handleLatestTen = this.handleLatestTen.bind(this);
    this.handleReset = this.handleReset.bind(this);
    //---------- Here we're defining and setting the state object for our application ----------
    this.state = {
      //Data from the user form selection
      userInput: {
        userSelYearMin: "",
        userSelYearMax: "",
        userSelPriceMin: "",
        userSelPriceMax: "",
        userSelCounty: "",
        userSelSearchTerm: "",
        userSelSortBy: ""
      },
      //data from our calculations
      numSearchResults: 0,
      filterResults: [],
      userInfo: "",
      averagePrice: 0,
      currentDate: date
    };
  } // end constructor

  //---------- Here we create our event handling methods ----------

  /** This is the method called when the search form box changes **/
  /** Javascript will create an event object for you **/
  onAddressFormChange(event) {
    //Delete userInfo value if nothing is typed in the address field
    if (event.target.value === "") {
      this.setState({
        userInfo: ""
      });
    }
    //User input validation. Only accept alpha-numeric characters
    else if (!event.target.value.match("^[a-zA-Z0-9]+$")) {
      this.setState({
        userInfo:
          "Invalid character detected. Please use letters and numbers only!"
      });
    } else {
      //else we don't display anything as user input is alpha-numeric

      let newUserInput = this.state.userInput;
      newUserInput.userSelSearchTerm = event.target.value;
      this.setState({ userInput: newUserInput });
      this.doFilterProperty();
    }
  }

  handleYearMinChange(event) {
    let newUserInput = this.state.userInput;
    newUserInput.userSelYearMin = event.target.value;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }

  handleYearMaxChange(event) {
    let newUserInput = this.state.userInput;
    newUserInput.userSelYearMax = event.target.value;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }

  handlePriceMinChange(event) {
    let newUserInput = this.state.userInput;
    //remove the euro sign
    let tmp = event.target.value.slice(0);
    //remove comas
    tmp = tmp.replace(",", "");
    newUserInput.userSelPriceMin = tmp;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }

  handlePriceMaxChange(event) {
    let newUserInput = this.state.userInput;
    //remove the euro sign
    let tmp = event.target.value.slice(0);
    //remove comas
    tmp = tmp.replace(",", "");
    newUserInput.userSelPriceMax = tmp;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }

  handleCountyChange(event) {
    let newUserInput = this.state.userInput;
    newUserInput.userSelCounty = event.target.value;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }

  handleSortByChange(event) {
    let newUserInput = this.state.userInput;
    newUserInput.userSelSortBy = event.target.value;
    this.setState({ userInput: newUserInput });
    this.doFilterProperty();
  }
  //---------- Function that will list the last ten sale transactions in the database ----------
  handleLatestTen(event) {
    // Sort in ascending order, then get last 10 elements of it (slice method)
    let lastTenEntries = localdataPPR
      .sort(function (current, next) {
        let currentD = current.Date_of_Sale.toLocaleLowerCase();
        let nextD = next.Date_of_Sale.toLocaleLowerCase();

        if (currentD < nextD) {
          return -1;
        } else if (currentD > nextD) {
          return 1;
        } else {
          return 0;
        }
      })
      .slice(-10);
    this.setState({ filterResults: lastTenEntries });
    if (lastTenEntries.length > 0) {
      this.setState({
        userInfo: lastTenEntries.length + " properties found."
      });
    }
    this.setState({ userSelSortBy: lastTenEntries.length });
  }
  //---------- This sort method is invoked on the properties that our filter function returned ----------
  sortFilteredProperties(sortParam) {
    return function (a, b) {
      switch (sortParam) {
        case sortPriceAsc:
          if (a.Price < b.Price) {
            return -1;
          } else if (a.Price > b.Price) {
            return 1;
          }
          return 0;
        case sortPriceDesc:
          if (a.Price > b.Price) {
            return -1;
          } else if (a.Price < b.Price) {
            return 1;
          }
          return 0;
        case sortYearAsc:
          if (a.Date_of_Sale < b.Date_of_Sale) {
            return -1;
          } else if (a.Date_of_Sale > b.Date_of_Sale) {
            return 1;
          }
          return 0;
        case sortYearDesc:
          if (a.Date_of_Sale > b.Date_of_Sale) {
            return -1;
          } else if (a.Date_of_Sale < b.Date_of_Sale) {
            return 1;
          }
          return 0;
        case sortCountyAZ:
          if (a.County < b.County) {
            return -1;
          } else if (a.County > b.County) {
            return 1;
          }
          return 0;
        case sortCountyZA:
          if (a.County > b.County) {
            return -1;
          } else if (a.County < b.County) {
            return 1;
          }
          return 0;
        default:
          return 0;
      }
    };
  }

  handleReset(event) {
    window.location.reload(false);
  }

  //---------- Here we have the main filter function ----------
  propertyFilterFunction(inputFromUser) {
    return function (ppr) {
      // convert everything to lower case for string matching
      let address = ppr.Address.toLowerCase();
      if (inputFromUser.userSelCounty.toLowerCase() === sortAny.toLowerCase()) {
        return (
          address.includes(inputFromUser.userSelSearchTerm.toLowerCase()) &&
          ppr.Date_of_Sale.slice(0, 4) >= inputFromUser.userSelYearMin &&
          ppr.Date_of_Sale.slice(0, 4) <= inputFromUser.userSelYearMax &&
          ppr.Price >= inputFromUser.userSelPriceMin &&
          ppr.Price <= inputFromUser.userSelPriceMax
        );
      } else {
        return (
          address.includes(inputFromUser.userSelSearchTerm.toLowerCase()) &&
          ppr.Date_of_Sale.slice(0, 4) >= inputFromUser.userSelYearMin &&
          ppr.Date_of_Sale.slice(0, 4) <= inputFromUser.userSelYearMax &&
          ppr.Price >= inputFromUser.userSelPriceMin &&
          ppr.Price <= inputFromUser.userSelPriceMax &&
          ppr.County.toLowerCase() === inputFromUser.userSelCounty.toLowerCase()
        );
      }
    };
  }
  //----user input limited and error message showing up ------
  doFilterProperty() {
    let filterPropertiesTemp = localdataPPR.filter(
      this.propertyFilterFunction(this.state.userInput)
    );

    let sortedResults = filterPropertiesTemp.sort(
      this.sortFilteredProperties(this.state.userInput.userSelSortBy)
    );

    this.setState({ filterResults: sortedResults });

    if (filterPropertiesTemp.length > 0) {
      this.setState({
        userInfo: filterPropertiesTemp.length + " properties found."
      });
    } else {
      this.setState({
        userInfo: "No property found, please try another address!"
      });
    }
  }
  //-------- calculate Average Price --------
  calculateAveragePrice() {
    let selectedProperties = this.state.filterResults;
    let numberOfSelected = selectedProperties.length;
    let selectedPropertiesTotalValue = selectedProperties.reduce(
      getTotalPrice,
      0.0
    );

    return selectedPropertiesTotalValue / numberOfSelected;
  }
  //-------- find latest entry (date of sale) in in our database --------
  findLatestEntryInDatabase() {
    return localdataPPR.reduce(function (prev, current) {
      return prev.Date_of_Sale > current.Date_of_Sale ? prev : current;
    });
  }

  //---------- This is the main render function ----------
  render() {
    return (
      <div className="App">
        <div class="container">
          <h6>
            {" "}
            <br></br>
            Welcome to Property Regie. Today is: {this.state.currentDate}
          </h6>
          <h6>
            {" "}
            Register last updated on:{" "}
            {this.findLatestEntryInDatabase().Date_of_Sale}
          </h6>
          <br></br>
          <button
            onClick={this.handleLatestTen}
            type="button"
            className="btn btn-success btn-sm"
          >
            Latest 10 Entries
          </button>
          <br></br>
          <br></br>
          <img src={logo_white} alt="Logo" />
          <br></br>
          <br></br>
          <h2>Search Criteria</h2>
          <form class="">
            <div id="true">
              <div class="row">
                <div class="col-s-3">
                  <b> Year Min </b>
                  <select
                    value={this.state.userInput.userSelYearMin}
                    onChange={this.handleYearMinChange}
                  >
                    <option value=""> Select...</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
                <div class="col-s-3">
                  <b> Year Max </b>
                  <select
                    value={this.state.userInput.userSelYearMax}
                    onChange={this.handleYearMaxChange}
                  >
                    <option value=""> Select...</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-s-3">
                  <b> Price Min </b>
                  <select
                    value={this.state.userInput.userSelPriceMin}
                    onChange={this.handlePriceMinChange}
                  >
                    <option value=""> Select...</option>
                    <option value="0">€0</option>
                    <option value="50000">€50,000</option>
                    <option value="100000">€100,000</option>
                    <option value="200000">€200,000</option>
                    <option value="250000">€250,000</option>
                    <option value="300000">€300,000</option>
                    <option value="350000">€350,000</option>
                    <option value="400000">€400,000</option>
                    <option value="450000">€450,000</option>
                    <option value="500000">€500,000</option>
                    <option value="550000">€550,000</option>
                    <option value="1000000">€1,000,000</option>
                  </select>
                </div>
                <div class="col-s-3">
                  <b> Price Max </b>
                  <select
                    value={this.state.userInput.userSelPriceMax}
                    onChange={this.handlePriceMaxChange}
                  >
                    <option value=""> Select...</option>
                    <option value="0">€0</option>
                    <option value="50000">€50,000</option>
                    <option value="100000">€100,000</option>
                    <option value="200000">€200,000</option>
                    <option value="250000">€250,000</option>
                    <option value="300000">€300,000</option>
                    <option value="350000">€350,000</option>
                    <option value="400000">€400,000</option>
                    <option value="450000">€450,000</option>
                    <option value="500000">€500,000</option>
                    <option value="550000">€550,000</option>
                    <option value="1000000">€1,000,000</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-s-3">
                  <b>County </b>
                  <select
                    value={this.state.userInput.userSelCounty}
                    onChange={this.handleCountyChange}
                  >
                    <option value={sortSelect}>{sortSelect}</option>
                    <option value={sortAny}>{sortAny}</option>
                    <option value="Carlow">Carlow</option>
                    <option value="Cavan">Cavan</option>
                    <option value="Clare">Clare</option>
                    <option value="Cork">Cork</option>
                    <option value="Donegal">Donegal</option>
                    <option value="Dublin">Dublin</option>
                    <option value="Galway">Galway</option>
                    <option value="Kerry">Kerry</option>
                    <option value="Kildare">Kildare</option>
                    <option value="Kilkenny">Kilkenny</option>
                    <option value="Laois">Laois</option>
                    <option value="Leitrim">Leitrim</option>
                    <option value="Limerick">Limerick</option>
                    <option value="Longford">Longford</option>
                    <option value="Louth">Louth</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Meath">Meath</option>
                    <option value="Monaghan">Monaghan</option>
                    <option value="Offaly">Offaly</option>
                    <option value="Roscommon">Roscommon</option>
                    <option value="Sligo">Sligo</option>
                    <option value="Tipperary">Tipperary</option>
                    <option value="Waterford">Waterford</option>
                    <option value="Westmeath">Westmeath</option>
                    <option value="Wexford">Wexford</option>
                    <option value="Wicklow">Wicklow</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
          <div>
            <hr />
            <form>
              <b> Address </b>
              <input
                type="text"
                placeholder="e.g. apt., street, city"
                onChange={this.onAddressFormChange}
              />{" "}
              (optional)
            </form>
            {this.state.filterResults.length === 0 && (
              <div class="text-warning">
                <b>{this.state.userInfo}</b>
              </div>
            )}
            <hr />
          </div>
          <form>
            <div>
              <b> Sort By </b>
              <select
                value={this.state.userInput.userSelSortBy}
                onChange={this.handleSortByChange}
              >
                <option value={sortSelect}>{sortSelect}</option>
                <option value={sortYearAsc}>{sortYearAsc}</option>
                <option value={sortYearDesc}>{sortYearDesc}</option>
                <option value={sortPriceAsc}>{sortPriceAsc}</option>
                <option value={sortPriceDesc}>{sortPriceDesc}</option>
                <option value={sortCountyAZ}>{sortCountyAZ}</option>
                <option value={sortCountyZA}>{sortCountyZA}</option>
              </select>
            </div>
          </form>
          <div>
            <hr />
            <button
              onClick={this.handleReset}
              type="button"
              class=" btn btn-success btn-s btn-block"
            >
              Reset Search Criteria
            </button>
          </div>
          {this.state.filterResults.length > 0 && (
            <div class="SearchResultsDisplay">
              <hr />
              <br></br>
              <h2>Search Results</h2>
              {this.state.userInfo}
              <br></br>
              <b>Average Price</b>:€{this.calculateAveragePrice().toFixed(2)}
              <hr />
              <table class="table table-striped table-bordered table-hover table-sm">
                <thead class="thead-dark">
                  <tr>
                    <th>Date of Sale</th>
                    <th>Address</th>
                    <th>County</th>
                    <th>Price</th>
                    <th>Property description</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.filterResults.map((a) => (
                    <tr key={a.id}>
                      <td>{a.Date_of_Sale}</td>
                      <td>{a.Address}</td>
                      <td>{a.County}</td>
                      <td>€{a.Price} </td>
                      <td>{a.Description_of_Property}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
            </div>
          )}
          <div>
            <h6> Copyright 2020-2020 by Team Mercury. All Rights Reserved.</h6>
            <h6>
              Property Regie is using data from Property Price Register which is
              provided by Property Services Regulatory Authority. This data is
              licensed on the source of data - Property Services Regulatory
              Authority as well as their original copyright:
              http://psr.ie/en/PSRA/Pages/Re-Use_of_Information
            </h6>
          </div>
        </div>
      </div>
    ); // end of return statement
  } // end of render function
} // end of class

export default App;
