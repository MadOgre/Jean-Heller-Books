/*global $, jQuery, alert, angular, $scope*/
/*jslint regexp: true*/
(function () {
    'use strict';

    var app = angular.module("JeanHellerBooks", []);
    app.filter('unsafe', function ($sce) {
        return $sce.trustAsHtml;
    });

    app.controller("bookDescriptionCtrl", ['$scope', '$http', function ($scope, $http) {
        function getDescription(bookObjectContent) {
            var match, innerMatch, i = 0, regExp, result = [[], 0];
            match = bookObjectContent.match(/(?:<h(?:\w|\s|\")*>About(?:\w|\s)*<\/h(?:\w|\s|\")*>)(\s*<p>.*<\/p>)+/);
            if (!match) {
                window.console.log("Error: DESCRIPTION MATCH IS BLANK!");
            }
            regExp = /<p>(.*)<\/p>/g;
            while ((innerMatch = regExp.exec(match[0])) !== null) {
                if (innerMatch[1] === "<!--more-->") {
                    result[1] = result[0].length;
                } else {
                    //innerMatch = innerMatch[1].replace(/<.*>/g, "");
                    result[0].push(innerMatch[1]);
                }
            }

            if (result[1] === 0) {
                result[1] = result[0].length;
            }

            return result;
        }
        function getAmazonLink(bookObjectContent) {
            var match, innerMatch, i = 0, regExp, result = [];
            match = bookObjectContent.match(/(?:<h(\w|\s|\"|=|-)+>Buy the Book<\/h(\w|\s|\"|=|-)+>\s*<p><a\s*href=")(.*?)(?:")/);
            if (!match) {
                return "";
            }
            return match[3];
        }
        $scope.books = [];
        $http.get('http://jeanhellerbooks.indigo-grove.com/wp-json/wp/v2/posts/?filter[category_name]=books&filter[order]=DESC&filter[posts_per_page]=3')
            .success(function (data) {
                //data = data.reverse();
                data.forEach(function (bookObject) {
                    var temp = {}, description = getDescription(bookObject.content.rendered);
                    temp.title = bookObject.title.rendered;
                    temp.description = description[0];
                    temp.excerptParagraphs = description[1];
                    temp.amazonLink = getAmazonLink(bookObject.content.rendered);
                    $http.get('http://jeanhellerbooks.indigo-grove.com/wp-json/wp/v2/media/' + bookObject.featured_image)
                        .success(function (data) {
                            temp.thumbnailImage = data.media_details.sizes.full.source_url;
                        });
                    $scope.books.push(temp);
                    if (bookObject.sticky === true) {
                        $scope.stickyBook = $scope.books.length - 1;
                    }
                });
            });
        $scope.currentBook = 0;
        $('#descriptionModal').on('shown.bs.modal', function () {
            if ($scope.books[$scope.currentBook] && $scope.books[$scope.currentBook].amazonLink !== "") {
                $('.amazon-link').attr('data-original-title', '');
            } else {
                $('.amazon-link').attr('data-original-title', 'This title is not currently available for sale');
            }
            $('[data-toggle="tooltip"]').tooltip('fixTitle');
        });
        $scope.isAvailable = function (bookTitle) {
            if (!!$scope.books[bookTitle] && $scope.books[bookTitle].available) {
                return "";
            } else {
                return "This title is not currently available for sale";
            }
        };
    }]);
}());
