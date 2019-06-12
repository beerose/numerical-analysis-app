% house(Nationality, Color, Pet, Cigarette, Drink)

solve(Houses) :-
  length(Houses, 5),
  % Anglik ma czerwony dom
  member(house(english,red,_,_,_), Houses),
  % Hiszpan ma psa
  member(house(spanish,_,dog,_,_), Houses),
  % W zielonym domu pije się kawę
  member(house(_,green,_,_,coffee), Houses),
  % Ukrainiec pija herbatę
  member(house(ukrainian,_,_,_,tea), Houses),
  % Zielony dom sąsiaduje z białym
  adjacent(house(_,green,_,_,_), house(_,white,_,_,_), Houses),
  % Właściciel węża pali winstony
  member(house(_,_,_,winston,_), Houses),
  % W żółtym domu palą Koole
  member(house(_,yellow,_,kool,_), Houses),
  % W domu pośrodku piją mleko
  Houses = [_,_,house(_,_,_,_,milk),_,_],
  % Dom Norwega to pierszy z lewej
  Houses = [house(norwegian,_,_,_,_)|_],
  % Palacz Chesterfiledów jest sąsiadem własciciela lisa
  adjacent(house(_,_,fox,_,_), house(_,_,_,chesterfield,_), Houses),
  % W domu sąsiadującym z właścicielem konia palą Koole
  adjacent(house(_,_,_,kool,_), house(_,_,horse,_,_), Houses),
  % Palacz Lucky Strike pija sok
  member(house(_,_,_,luckystrike,juice), Houses),
  % Japończyk pali Kenty
  member(house(japanese,_,_,kent,_), Houses),
  % Norweg sąsiaduje z niebieskim domem
  adjacent(house(norwegian,_,_,_,_), house(_,blue,_,_,_), Houses),
  % #1 zagadka -- Kto jest właścicielem słonia
  member(house(_,_,elephant,_,_), Houses),
  % #2 zagadka -- Kto pije wódkę
    member(house(_,_,_,_,vodka), Houses).

adjacent(A, B, Ls) :- append(_, [A,B|_], Ls).
adjacent(A, B, Ls) :- append(_, [B,A|_], Ls).

drinks_vodka(X) :-
    solve(Houses),
    member(house(X,_,_,_,vodka), Houses).

has_elephant(X) :-
    solve(Houses),
    member(house(X,_,elephant,_,_), Houses).
