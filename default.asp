<%@ LANGUAGE="VBSCRIPT"%>
<%

If request.querystring("Evidenza") = "0" then Session("Visto") = false 

%>
<!-- #include file="Connection/connection.asp" -->
<!-- #include file="Classi/clsInizialize.asp" -->
<!-- #include file="Classi/clsIncontri.asp" -->
<!-- #include file="Classi/clsMessaggi.asp" -->
<!-- #INCLUDE file="Classi/clsPopolaCombo.asp" -->
<!-- #INCLUDE file="Classi/clsFormazioni.asp" -->
<!-- #INCLUDE file="Classi/clsFantasquadre.asp" -->
<!-- #INCLUDE file="Classi/clsGiocatori.asp" -->
<!-- #include file="Classi/clsClassifica.asp" -->
<!-- #include file="Classi/clsRosa.asp" -->
<!-- INCLUDE file="ckeditor/ckeditor.asp" -->

<%
    
dbConnection.Open

Session.LCID=1040

Function Esiste(cosa)
    Dim mioFile
    mioFile = Server.MapPath("images/giocatori/" & Replace(replace(replace(cosa, "'",""), " ", "-"), ".", "") & ".png")
        
    ' Definisco e creo l'oggetto FileSystemObject
    Dim objFile
    Set objFile = Server.CreateObject("Scripting.FileSystemObject")

    ' Verifico con FileExist se il file esiste 
    ' e rispondo di conseguenza
    If objFile.FileExists(mioFile) Then
        esiste = true
    Else
        esiste = false
    End If

    ' Faccio pulizia...
    Set objFile = Nothing

end Function

if Session("Access")="" then Session("Access") = 0 ' Non ho nessun accesso

set ini = new clsInizialize

'parEvidenza = ini.Evidenza
Set rs = dbConnection.Execute("SELECT * FROM tblEvidenza")
txtEvidenza = rs("Evidenza")

If txtEvidenza <> "" then ' se ho l'evidenza abilito il popup altrimenti no
    MettiPopUP = true
else
    MettiPopUp = false
end if

parGiornata = ini.Giornata() ' trovo la giornata
Session("Stagione") = ini.Stagione() ' trovo la stagione
parMaglia = ini.RecuperaMaglia(Session("Access")) ' trovo la maglia di chi si è autenticato

parBloccoData = ini.BloccoData() ' trovo il prossimo blocco data
'response.write cdate(parBloccoData)
parDescrizioneBloccoData = ini.DescrizioneBloccoData ' trovo la descrizione del prossimo blocco data
parPerFormazione = ini.perFormazione 'trovo se è inserimento formazione
Session("TipoBloccoData") = ini.perTipoBloccoData ' trovo il tipo di blocco data

    ' divido il blocco data per l'utilizzo nella funzione javascript del contatore
	a = CInt(Mid(parBloccoData, 7,4))
	m = (CInt(Mid(parBloccoData, 4,2))-1)
	d = CInt(Mid(parBloccoData, 1,2))
	o = CInt(Mid(parBloccoData, 12,2))
	mi = CInt(Mid(parBloccoData, 15,2))
	s = CInt(Mid(parBloccoData, 18,2))

set ini = Nothing

'verifico se in questa giornata ci sono coppe
strSQL = "Select * From tblGiornateCoppa WHERE Stagione = '" & Session("Stagione") & "' AND Giornata = " & parGiornata + 1
set rsCoppa = dbconnection.execute(strsql)
oggicoppa = false
if not rscoppa.eof then 
    oggicoppa = true    
    'response.write "Sto cercando il nome della coppa<br>" 
    strSQL = "SELECT * FROM tblTipologiaCoppe WHERE IDTipologiaCoppa = " & rsCoppa("TipoCoppa")
    set rs1 = dbconnection.execute(strSQL)
    nomecoppa = rs1("Denominazione")
    rs1.close
    'if oggicoppa then response.write "Coppa trovata: " & nomecoppa & "<br>"
end if

'response.write parBloccoData & "<br>"

' verifico se devo aggiornare la giornata
if request.QueryString("Aggiorna") = 1 then
	set rsScarto = dbconnection.execute("Select * From tblScarto")
	If CInt(Session("TipoBloccoData")) = 2 then 'SI DOVEVA INSERIRE LA FORMAZIONE
        AggiornaStatoTipo2(rsScarto("Scarto"))
        if oggicoppa then 
            'response.write "Ora inserisco la news " & nomecoppa & "<br>"
            InserisciNewsCoppa pargiornata+1, nomecoppa 
        end if
    elseif CInt(Session("TipoBloccoData")) = 4 then 'SI DEVEVA INSERIRE LA CONFERMA DEI GIOCATORI
        AggiornaStatoTipo4()
    else
        AggiornaStato()
    end if
	set rsScarto = nothing
	response.Redirect("default.asp?IDPage=1")
end if

Sub AggiornaOrdineNews() 'aggiorno l'ordine delle news

	set objrs = dbconnection.execute("SELECT Number FROM tblHowManyNews")
	max = objrs("Number")
	strSQL = "SELECT TOP " & max
	strSQL = strSQL & " * FROM tblNews WHERE (Posizione>=1 AND Posizione<=" & max
	strSQL = strSQL & ") ORDER BY Posizione" 
	
	set objrs = Server.CreateObject("ADODB.Recordset")
	objrs.open strSQL, dbConnection, 3,3
	
	do while not(objrs.eof)
	
		if Not(isNull(objrs("Posizione"))) then
			if objrs("Posizione") = max then
				objrs("Posizione") = Null
			else
				objrs("Posizione") = objrs("Posizione") + 1
			end if
		end if
		
		objrs.movenext
	loop
	objrs.close
	set objrs = nothing
End Sub

Sub InserisciNewsCoppa (giornata, nomecoppa) 'inserisci la news della coppa
    if OggiCoppa then
        strSQL = "SELECT * FROM tblGiornateCoppa WHERE Stagione = '" & Session("Stagione") & "' AND Giornata = " & giornata & " ORDER BY Ordine DESC, Intestazione"
        set rsCoppa = dbconnection.execute(strSQL)
        testoHome= ""
        
        if not(rsCoppa.eof) then
            TestoHome = "<table border=""0"" cellpadding=""1"" cellspacing=""1"" style=""width: 300px;""><tbody><tr><td colspan=""3"" rowspan=""1"" " & _
                    "style=""text-align: center;""><b>" & rsCoppa("Intestazione") & "</b></td></tr>"
            gruppo = rsCoppa("Intestazione")
            set nomefs = new clsFantasquadre
            nomefs.create
            do while not(rsCoppa.eof)
                if rsCoppa("Intestazione") = gruppo then
                    
                    TestoHome = TestoHome & "<tr><td style = ""width:130px;text-align:right"">" & nomefs.NomeSquadra(rsCoppa("Squadra1")) & _
                                "</td><td> - </td><td style = ""width:130px;text-align:left"">" & nomefs.NomeSquadra(rsCoppa("Squadra2")) & "</td><tr>"
                else
                    
                    gruppo = rsCoppa("Intestazione")
                    TestoHome = TestoHome & "<tr><td colspan=""3"" rowspan=""1"" " & _
                                "style=""text-align: center;""><b>" & rsCoppa("Intestazione") & "</b></td></tr>"
                    TestoHome = TestoHome & "<tr><td style = ""width:130px;text-align:right"">" & nomefs.NomeSquadra(rsCoppa("Squadra1")) & _
                                "</td><td> - </td><td style = ""width:130px;text-align:left"">" & nomefs.NomeSquadra(rsCoppa("Squadra2")) & "</td><tr>"
                end if
                rsCoppa.movenext
            loop
            set nomefs = nothing
            testohome = testohome & "</tbody></table>"
        end if
        set rsCoppa = nothing
        'response.write "Inserimento news in corso<br>"
        AggiornaOrdineNews()
        set rsINC = Server.CreateObject("ADODB.Recordset")
        rsINC.open "tblNews", dbconnection, 3, 3
	    rsINC.addnew
	    rsINC("Tipo") = 1
	    rsINC("Titolo") = giornata & "^ Giornata - " & nomecoppa
	    rsINC("TestoHome") = TestoHome
	    rsINC("Data") = date()
	    'rsINC("Approfondimenti") = Approfondimenti
	    rsINC("Posizione") = 1
	    rsINC("Pubblicata") = true
	    rsINC("icona") = "icone_news/uefa-champions-league-1-icon1.png"
	    rsINC("Stagione") = Session("Stagione")
	    rsINC("Categoria") = 1
	    rsINC.update
	    rsINC.close
	    set rsINC=nothing
        'response.write "News inserita<br>"
	end if
end Sub

Sub InserisciNewsConfermaFormazione(squadre) ' inserisci news che conferma automaticamente la formazione per chi non l'ha inserita
	set rsINCF = Server.CreateObject("ADODB.Recordset")
	set rsINCF2 = Server.CreateObject("ADODB.Recordset")
	'set rs3 = Server.CreateObject("ADODB.Recordset")
	g = split(squadre, "|")
	
	for i = 0 to ubound(g) - 1
		
		rsINCF.open "SELECT * From tblFantasquadre Where IDFantasquadra = " & cint(g(i)), dbconnection, 3, 3
		rsINCF2.open "tblNews", dbconnection, 3, 3
		'do while not(rs.eof)
			
			rsINCF2.addnew
			rsINCF2("Tipo") = 1
			rsINCF2("Titolo") = rsINCF("Nome") & " non consegna la formazione per la " & cstr(pargiornata) & "^ giornata."
			rsINCF2("TestoHome") = "Il sistema ha provveduto a confermare la formazione della giornata precedente"
			rsINCF2("Data") = date()
			strsql = "SELECT tblGiocatori.Nome, tblFormazione.Stagione, tblGiocatori.Stagione, tblFormazione.Giornata, tblFormazione.IDFantasquadra, tblFormazione.Ordine FROM tblFormazione INNER JOIN tblGiocatori ON tblFormazione.Codice = tblGiocatori.Codice WHERE (((tblFormazione.Stagione)='" & Session("Stagione") & "') AND ((tblGiocatori.Stagione)='" & Session("Stagione") & "') AND ((tblFormazione.Giornata)=" & (pargiornata-1) & ") AND ((tblFormazione.IDFantasquadra)=" & cint(g(i))& ")) ORDER BY tblFormazione.Ordine"
			set rsINCF3 = dbconnection.execute(strsql)
			Approfondimenti = "<div>&nbsp;</div><div><b>Titolari:</b> "
			do while not(rsINCF3.eof)
				
				if rsINCF3("Ordine") < 11 then
						Approfondimenti = Approfondimenti & rsINCF3("Nome") & ", "
				elseif rsINCF3("Ordine") = 11 then
						Approfondimenti = Approfondimenti & rsINCF3("Nome") & ".<br><b>Riserve:</b> "
				elseif (rsINCF3("Ordine") > 11) AND (rsINCF3("Ordine")<19) then
						Approfondimenti = Approfondimenti & rsINCF3("Nome") & ", "
				elseif rsINCF3("Ordine") = 19 then
						Approfondimenti = Approfondimenti & rsINCF3("Nome") & ".<br></div><div>&nbsp;</div>"
				end if
				rsINCF3.movenext
			loop
			set rsINCF3 = nothing
			rsINCF2("Approfondimenti") = Approfondimenti
			rsINCF2("Posizione") = 1
			rsINCF2("Pubblicata") = true
			rsINCF2("icona") = "avatar/" & rsINCF("Avatar")
			rsINCF2("Stagione") = Session("Stagione")
			rsINCF2("Categoria") = 4
			rsINCF2.update
			rsINCF.movenext
			AggiornaOrdineNews()
		'loop
		rsINCF2.close
		rsINCF.close
	next
	set rsINCF2 = nothing
	set rsINCF = nothing
End Sub

Sub InserisciNewsPenalita(squadre)	' inserisci news penalità consegna formazione
	set rsINP = Server.CreateObject("ADODB.Recordset")
	g = split(squadre, "|")
	
	testohome = ""
	
	for i = 0 to ubound(g) - 1
		rsINP.open "SELECT Nome From tblFantasquadre Where IDFantasquadra = " & cint(g(i)), dbconnection, 3, 3
		do while not(rsINP.eof)
			TestoHome = testohome & rsINP("Nome") & " "
			rsINP.movenext
		loop
		rsINP.close
	next
	
	if ubound(g) > 1 then
		TestoHome = TestoHome & "non consegnano la formazione per la " & pargiornata & "^ giornata."
	else
		TestoHome = TestoHome & "non consegna la formazione per la " & pargiornata & "^ giornata."
	end if
	strSQL = "SELECT * FROM tblFantasquadre WHERE NonInviata > 0 Order By NonInviata DESC"
	rsINP.open strSQL, dbconnection, 3, 3
	Approfondimenti = "<div>&nbsp;</div><div>Ecco la situazione aggiornata alla " & pargiornata & "^ giornata:</div><div>&nbsp;</div><table cellspacing=""0"" cellpadding=""0"" width=""150"" border=""0""><tbody>"
	do while not(rsINP.eof)
		Approfondimenti =  Approfondimenti & "<tr><td>" & rsINP("nome") & "</td><td>-" & rsINP("NonInviata") & "&euro;</td></tr>"
		rsINP.movenext
	loop
	Approfondimenti = Approfondimenti & "</tbody></table><div>&nbsp;</div>"
	rsINP.close
	
	rsINP.open "tblNews", dbconnection, 3, 3
	rsINP.addnew
	rsINP("Tipo") = 1
	rsINP("Titolo") = "Aggiornamento penalità per mancata consegna formazione"
	rsINP("TestoHome") = TestoHome
	rsINP("Data") = date()
	rsINP("Approfondimenti") = Approfondimenti
	rsINP("Posizione") = 1
	rsINP("Pubblicata") = true
	rsINP("icona") = "icone_news/penalità.jpg"
	rsINP("Stagione") = Session("Stagione")
	rsINP("Categoria") = 2
	rsINP.update
	rsINP.close
	set rsINP=nothing

end sub

Sub AggiornaFormazione(id, gior, stag) 'aggiorna le formazione per chi non l'ha inserita
    strSQL = "SELECT * FROM tblFormazione WHERE IDFantasquadra = " & Cint(id) & " AND Giornata = " & cInt(gior-1) & " AND Stagione = '" & stag & "'"
    'response.write strSQL
	set rsFormazione = dbConnection.execute(strSQL)
	'set rs2 = Server.CreateObject("ADODB.Recordset")
	'rs2.Open "Select * FROM tblFormazione", dbConnection ,3,3
	set f = new clsFormazioni
	f.create
	f.Stagione = stag
	f.Giornata = cint(gior)
    'response.write id & "<br>"
	f.IDFantasquadra = Cint(id)
	do while not(rsFormazione.eof)
		f.Codice = rsFormazione("Codice")
		f.Ordine = rsFormazione("Ordine")
		if f.ordine <= 11 then
			f.Gioca = true
			f.GiocaNA = true
			F.GiocaRM = true
		else
			f.Gioca = False
			f.GiocaNA = False
			F.GiocaRM = False
		end if
		f.registraformazione
		'rs2.update
		rsFormazione.movenext
	loop
	'rs2.close
	'set rs2 = nothing
	set f = nothing
	set rsFormazione = nothing
End Sub

Sub ResetVariabileInserita() ' IMPOSTA A FALSE IL CAMPO tblFantasquadre.Inserita

    set rsRVI = Server.CreateObject("ADODB.Recordset")
	strsql = "UPDATE tblFantasquadre SET Inserita = false WHERE (isAttivo = true) AND (Inserita = true)"
	rsRVI.open strsql, dbconnection, 3, 3
	set rsRVI = nothing

End Sub

Sub CambiaBloccoData(giornata, data) 'cambia il blocco data

    set rsCBD = Server.CreateObject("ADODB.Recordset")
	'strsql = "SELECT * FROM tblAggiornamentoGiornata WHERE Giornata = " & (Cint(parGiornata) + cint(scarto))
	'strsql = "UPDATE tblAggiornamentoGiornata SET Aggiornata = true WHERE Giornata = " & parGiornata
    engData = Mid(data,4,2) & "/" & Mid(data,1,2) & "/" & Right(data, 13)
	strsql = "SELECT Giornata, Data, Aggiornata, Tipo from tblAggiornamentoGiornata Where Aggiornata = false AND Giornata = " & giornata & " AND Data = #" & cdate(engData) & "# order by data"
    'response.write strSQL
    
    rsCBD.open strsql, dbconnection, 3, 3
	if not rsCBD.eof then
		rsCBD("Aggiornata") = true
		rsCBD.update
	end if
	rsCBD.close
	set rsCBD = nothing

End Sub

Sub CambiaGiornata() ' la giornata deve essere cambiata solo quando inserisco la formazione. (TIPO 2)

    set rsCG = Server.CreateObject("ADODB.Recordset")
	rsCG.open "Stato", dbconnection, 3, 3
	'rsCG("Giornata") = rsCG("Giornata") + 1
    rsCG("Giornata") = parGiornata + 1
	rsCG.update
	rsCG.close
	set rs = nothing

End Sub

Sub AggiornaStato() 'cambia lo stato

    ResetVariabileInserita()
	CambiaBloccoData Cint(parGiornata), parBloccoData

End Sub

Sub AggiornaStatoTipo2(scarto) ' Consegna formazione

	set rsAST2 = Server.CreateObject("ADODB.Recordset") 
	strSQL = "SELECT IDFantasquadra, NonInviata FROM tblFantasquadre WHERE (Inserita = false) AND (isAttivo = true)"
	rsAST2.open strsql, dbconnection, 3, 3 ' trovo i team attivi che non hanno consegnato la formazione
	
	varsquadre = ""
	if not(rsAST2.eof) then
		do while not(rsAST2.eof)
			'response.write vbcrlf & "pporcaputtana " & pargiornata & vbcrlf & vbcrlf
            'response.write rsAST2("IDFantasquadra") & ", " & parGiornata & ", " & Session("Stagione")
			AggiornaFormazione rsAST2("IDFantasquadra"), parGiornata, Session("Stagione") ' copio la formazione precedente
			varsquadre = varsquadre & rsAST2("IDFantasquadra") & "|" 
			rsAST2("NonInviata") = rsAST2("NonInviata") + 1
			rsAST2.update
			rsAST2.movenext
		loop
	end if
	rsAST2.close
	set rsAST2 = nothing
	response.write varsquadre

	if varsquadre <> "" then  ' eseguo solo se c'è almeno un team che non ha consegnato la formazione
		AggiornaOrdineNews()
		InserisciNewsConfermaFormazione(varsquadre)
		InserisciNewsPenalita(varsquadre)
	end if

    'strSQL = "SELECT Giornata from Stato"
    'set rsGiornataAttuale = dbconnection.execute(strsql)
    'parametro = rsGiornataAttuale("Giornata")
    'set rsGiornataAttuale = nothing
    'response.write "Stato = " & parametro & "<br/>"
    'response.write "parGiornata = " & parGiornata & "<br/>"
	ResetVariabileInserita()
	CambiaBloccoData (Cint(parGiornata) + cint(scarto)), parBloccoData
	CambiaGiornata()
    
end sub

Sub AggiornaStatoTipo4() ' Consegna lista conferme giocatori

    'TEAM CHE NON HANNO CONSEGNATO LA LISTA CONFERMA GIOCATORI
	set rsG = Server.CreateObject("ADODB.Recordset") 
	strSQL = "SELECT IDFantasquadra, NonInviata FROM tblFantasquadre WHERE (Inserita = false) AND (isAttivo = true)"
	rsG.open strsql, dbconnection, 3, 3 ' trovo i team attivi che non hanno consegnato la lista conferma giocatori
	
	if not(rsG.eof) then 'qualcuno non ha consegnato la lista quindi ...
        set Giocatori = new clsGiocatori
        Giocatori.Create
		do while not(rsG.eof) ' ... tolgo tutti i giocatori dalle fantasquadre e li svincolo

            strSQL = "SELECT * FROM tblRosa WHERE IDFantasquadra = " & rsG("IDFantasquadra") & " AND Stagione = '" & Session("Stagione") & "'"
			set rsR = dbConnection.Execute(strSQL)     
            do while not(rsR.eof)

                'Giocatori.VendiGiocatore Session("Stagione"), rsR("Codice"), rsG("IDFantasquadra") 
                Giocatori.richiamagiocatori session("Stagione"), rsR("Codice")
                Giocatori.SvincolaGiocatore Session("Stagione"), rsR("Codice")
                set r = new clsrosa
		        'r.basepath = "../../"
		        r.create
		        r.svincolagiocatore Session("Stagione"), rsR("Codice")
                rsR.movenext

			loop
            set rsR = nothing
			rsG.update
			rsG.movenext
		loop
        set Giocatori = nothing
	end if
	rsG.close
	set rsG = nothing
	
    'TEAM CHE HANNO CONSEGNATO LA LISTA CONFERMA GIOCATORI
    set rsG = Server.CreateObject("ADODB.Recordset") 
	strSQL = "SELECT IDFantasquadra, NonInviata FROM tblFantasquadre WHERE (Inserita = true) AND (isAttivo = true)"
	rsG.open strsql, dbconnection, 3, 3 ' trovo i team attivi che non hanno consegnato la lista conferma giocatori
	
	if not(rsG.eof) then 'qualcuno ha consegnato la lista quindi...
        set Giocatori = new clsGiocatori
        Giocatori.Create
		do while not(rsG.eof) ' ... tolgo solo i giocatori non confermati dalle fantasquadre e li svincolo

            strSQL = "SELECT * FROM tblRosa WHERE IDFantasquadra = " & rsG("IDFantasquadra") & " AND Stagione = '" & Session("Stagione") & "'"
			set rsR = dbConnection.Execute(strSQL)     
            do while not(rsR.eof)
                strSQL = "SELECT * FROM tblConfermaGiocatori WHERE IDFantasquadra = " & rsG("IDFantasquadra") & " AND Codice = " & rsR("Codice")
			    set rsP = dbConnection.Execute(strSQL) 
                if rsP.eof then ' se non è presente nella lista dei confermati lo vendo e lo svincolo
                    'Giocatori.VendiGiocatore Session("Stagione"), rsR("Codice"), rsG("IDFantasquadra") 
                    Giocatori.richiamagiocatori session("Stagione"), rsR("Codice")
                    Giocatori.SvincolaGiocatore Session("Stagione"), rsR("Codice")
                    set r = new clsrosa
		            'r.basepath = "../../"
		            r.create
		            r.svincolagiocatore Session("Stagione"), rsR("Codice")
		            set r = nothing
                else   ' se è presente lo inserisco nei contratti e lo lascio nella fantasquadra
                    strSQL = "Select * from tblContrattiGiocatori WHERE Stagione = '" & Session("Stagione") & "' AND IDFAntasquadra = " & rsG("IDFantasquadra") & _
                            " AND Codice = " & rsR("Codice")
                    set rsContratti = Server.CreateObject("ADODB.Recordset")
	                rsContratti.open strsql, dbconnection, 3, 3
                    if rsContratti.eof then ' giocatore non è presente nei contratti quindi lo aggiungo
                        'strSQL = "INSERT INTO tblContrattiGiocatori (Stagione, IDFantasquadra, Codice, Costo, Durata) VALUES ('" & Session("Stagione") & _
                                   ' "', " & rsG("IDFantasquadra") & ", " & rsR("Codice") & "', " & rsR("Costo") & ", 1"
                        'set rsAC = dbConnection.execute(strSQL)
                        rsContratti.addnew
                        rsContratti("Stagione") = Session("Stagione")
                        rsContratti("IDFantasquadra") = rsG("IDFantasquadra")
                        rsContratti("Codice") = rsR("Codice")
                        rsContratti("Costo") = rsR("Costo")
                        rsContratti("Durata") = 1
                        rsContratti.update
                    else ' giocatore presente quindi aggiorno il suo stato
                        rsContratti("Durata") = rsContratti("Durata") + 1
                        rsContratti.update
                    end if
                end if
                rsR.movenext
			loop
            set rsR = nothing
			rsG.update
			rsG.movenext
		loop
        set Giocatori = nothing
	end if
	rsG.close
	set rsG = nothing

	strSQL = "SELECT IDFantasquadra, Nome FROM tblFantasquadre WHERE (isAttivo = true)"
    set rsF = dbConnection.execute(strSQL)
    messaggio= ""

    do while not(rsF.eof)
        messaggio = messaggio & " <b>" & rsF("Nome") & "</b> conferma : <i>"
        strSQL = "SELECT tblGiocatori.Stagione, tblRosa.Stagione, tblRosa.IDFantasquadra, tblGiocatori.Nome, tblRosa.Costo " & _
            "FROM tblRosa INNER JOIN tblGiocatori ON (tblRosa.Stagione = tblGiocatori.Stagione) AND (tblRosa.Codice = tblGiocatori.Codice) " & _
            "WHERE (((tblGiocatori.Stagione)='" & Session("Stagione") & "') AND ((tblRosa.Stagione)='" & Session("Stagione") & "') AND ((tblRosa.IDFantasquadra)= " & _
               rsF("IDFantasquadra") & " AND tblGiocatori.Venduto = true))"
        
        set giocatori = dbConnection.execute(strSQL)
        
        if giocatori.eof then
            messaggio = messaggio & " nessuno.</i><br /><br />"
        else
            soldi = 0
            do while not(giocatori.eof) 
                soldi = soldi + cint(giocatori("Costo"))
                messaggio = messaggio & giocatori("Nome") & " " 
                giocatori.movenext
            loop
            messaggio = messaggio & "</i>. Soldi spesi : " & soldi & "<br /><br />"
        end if      

        rsF.movenext
    loop

    set news = new clsMessaggi
    news.Create

    news.IDFantasquadra = 11
    news.Stagione = Session("Stagione")
	news.Titolo = "Conferme giocatori stagione " & Session("Stagione")
    news.Testo = messaggio
	news.Data = Now()
	news.Ora = Time()
    news.Utente = "Lo Magno Notaro"
	news.NonModificabile = true
	news.Modificato = false
    news.RegistraMessaggio
      
    set news = nothing
    set rsF = nothing

    strSQL = "DELETE * FROM tblConfermaGiocatori"
    set rsErase = dbConnection.execute(strSQL)
    strSQL = "DELETE * FROM tblContrattiGiocatori WHERE Stagione <> '" & Session("Stagione") & "'"
    set rsErase = dbConnection.execute(strSQL)
    set rsErase = nothing

	AggiornaStato()
	
	'CambiaGiornata()

end sub

'-------------------------------------------------------------------------
'LA PROCEDURA AGGIORNA LE EVIDENZE
'-------------------------------------------------------------------------
Sub AggiornaEvidenza()

    set ini = new clsInizialize

    parEvidenza = ini.Evidenza

    If parEvidenza <> "" then
   
        'response.write "<div class='lavagna'>" 
	    %>
    	    <%=parEvidenza%>	   
     
	    <%
        'response.write "/div>"
    else
    
    end if

    set ini = Nothing

end sub 
'-------------------------------------------------------------------
'FINE PROCEDURA AGGIORNA NEWS IN HOMEPAGE
'-------------------------------------------------------------------



'-------------------------------------------------------------------------
'LA PROCEDURA AGGIORNA LE NEWS IN HOMEPAGE PRELEVANDO L'ELENCO 
'DA VISUALIZZARE IN ARCHIVIO
'-------------------------------------------------------------------------
Sub AggiornaNewsHP()
%>
<!-- #include file="Moduli/AggiornaNewsHP.asp" -->
<div style="height:5px;">&nbsp;</div>
<h1 id="pg">Sezione messaggi</h1>
<div style="height:5px;">&nbsp;</div>
<!-- #include file="Moduli/AggiornaMessaggiHP.asp" -->
<%
end sub 
'-------------------------------------------------------------------
'FINE PROCEDURA AGGIORNA NEWS IN HOMEPAGE
'-------------------------------------------------------------------

'-------------------------------------------------------------------
'PROCEDURA PER L'AGGIORNAMENTO DELLE PAGINE STANDARD
'-------------------------------------------------------------------
Sub AggiornaST()

parTitolo = rsPage("Titolo")

if rsPage("Testo") <> "<p>Testo</p>" then
	parContenuto = rsPage("Testo")	
else
	parContenuto = ""
end if 
%> 

<div class="wrapper">
	<!-- Main Content -->
	<div class="main">
		<div class="main-col">
        	<div class="pagetitle">
            	<%=parTitolo%>
			</div>
            <div style="padding:10px;">
				<div style="height:40px;">&nbsp;</div>
    	    	<%=parContenuto%>
        	    <div style="height:30px;">&nbsp;</div>
          	</div>
        </div>
        
        <!--<div class="side-col-news">
			<div class="netnews">
				<h3 class="side">
			         Scheda informazioni
		        </h3>
        		<div class="box">
			         Sezione in allestimento
		        </div>
			</div>
		</div> -->
	</div>
</div>
	
<%
end sub
'-------------------------------------------------------------------
'FINE PROCEDURA AGGIORNA PAGINE STANDARD
'-------------------------------------------------------------------

strSQL = "SELECT * FROM tblColonneLaterali"

set rs = dbConnection.Execute(strSQL)

Dx = rs("ColonnaDX")
Sx = rs("ColonnaSX")

rs.Close
set rs = nothing

'TROVA LA PAGINA SETTATA COME HOME
if Request.QueryString("IDPage") = "" then
	strSQL = "SELECT * FROM tblHomepage"
	set rsHome = dbConnection.Execute(strSQL)
	if NOT rsHome.EOF then
		parPage = rsHome("IDPage")
        Session("Home") = parPage
	else 
		parPage = 0
	end if
	If (parPage = 0) And (Session("Access") <> 2) Then 
        Session("Stop") = true
    else
        session("stop") = false
    end if
	rsHome.Close
	set rsHome = Nothing
	Response.Redirect("default.asp?IDPage=" & parPage)
else
	parPage = Request.QueryString("IDPage")
end if

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict/EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<title>Quelli del mercoled&igrave; - Fantacalcio</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta name="generator" content="qdm">
<meta name="description" content="qdm" />


<!--<link href="style/helper.css" media="screen" rel="stylesheet" type="text/css" />
<link href="style/dropdown.css" media="screen" rel="stylesheet" type="text/css" />
<link href="style/default.css" media="screen" rel="stylesheet" type="text/css" />-->

<link href="css/master.css" media="screen" rel="stylesheet" type="text/css" />
<!--<link rel="stylesheet" href="css/styles.css" />-->
<link rel="stylesheet" href="css/jquery.countdown.css" />

<!--<script type="text/javascript" src="js/jquery-1.5.min.js"></script>-->
    <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
<!--<script type="text/javascript" src="js/jquery-ui-1.8.9.custom.min.js"></script>-->
    <script type="text/javascript" src="js/jquery-ui.min.js"></script>
<link rel="stylesheet" type="text/css" href="style/ui-lightness/jquery-ui-1.8.9.custom.css" />

<script type="text/javascript">
	// dichiarazioni variabili globali
	var conto = 1;
	var formazione = new Array(19);
</script>

<script type="text/javascript"> 
<!-- 
function PopupCentrata() {   
	var w = 800;   
	var h = 600;   
	var l = Math.floor((screen.width-w)/2);   
	var t = Math.floor((screen.height-h)/2);       
	window.open("Moduli/SYS3.asp","","width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);}

	var anno = <%=a%>;
	var mese = <%=m%>;
	var giorno = <%=d%>;
	var ora = <%=o%>;
	var minuti = <%=mi%>;
	var secondi = <%=s%>;



//--> 
</script>
<!--[if lt IE 7]>
<script type="text/javascript" src="js/jquery/jquery.js"></script>
<script type="text/javascript" src="js/jquery/jquery.dropdown.js"></script>
<![endif]-->

<!-- / END -->

<link rel="shortcut icon" type="images/x-icon" href="/favicon.ico" />

<!--<link rel="stylesheet" type="text/css" href="pro_dropdown_2/pro_dropdown_2.css" />-->

<style type="text/css">
@import url("style/fs_standard.css");
a#viewcss{color: #00f;font-weight: bold}
</style>

<script type="text/javascript" src="/ckeditor/ckeditor.js"></script>


<!-- ******** INIZIO *********************************************-->

<%
if MettiPopUp AND ((not(Session("Visto"))) AND (Cint(parPage) = Cint(Session("Home")))) then 'And not(Session("Visto")) then
   PopUp_tempo = 10
   PopUp_width = 689
   PopUp_left = CInt((Session ("screenwidth")/2) - (PopUp_width/2))
   if Session ("screenwidth") <> "" then Session("Visto") = true
%>
<style type="text/css">
#banner {
	position: absolute;
	z-index: 500;
	border: solid 1px;
	width: 689px;
	height: 338px;
    
	margin: 267px 0 0 <%=PopUp_left%>px;
	padding: 0;
    background: url(images/sfondo_lavagna.png) no-repeat scroll 0 0 transparent;
    overflow:hidden;

    /*font-family:gessetto;
    color:#d2d0d0;*/

}

#banner div.lavagna {
        font-family:gessetto;
        text-align:left;
        width: 90%;
        height: 90%;
        color:#d2d0d0;
        margin: 30px;
        line-height:25px;
        font-size:150%;
        
    }
#chiudi
{
	position: absolute;
	border: solid 0px;
	width: 50px;
	left: 638px;
	top: -1px;
	padding-top: 2px;
	padding-right: 2px;
	font-family:Verdana, Arial, Helvetica, sans-serif;
	font-size: 10px;
	color: #9ECFFC;
	text-align: center;
	cursor: pointer;
}
</style>

<script type="text/javascript" language="javascript">
<!-- 
    function nascondi() {
        var banner = document.getElementById("banner");
        var chiudi = document.getElementById("chiudi");
        banner.style.display = "none";
        chiudi.style.display = "none";
    }

    //-->
</script>

<script src="menu/stuHover.js" type="text/javascript"></script>

</head>

<body <%if not PopUp_tempo = "0" then%>onload="setTimeout('nascondi();',<%=(PopUp_tempo*1000)%>)" <%end if%>style="background-repeat: repeat-x; background-attachment: fixed;" topmargin="0" leftmargin="0" marginwidth="0" marginheight="0" >
<!-- Inizio codice POP-UP -->
<div id="banner"><div id="chiudi" align="right"><span onClick="nascondi();"><font color="#FFFFFF"><b>chiudi</b></font> <img src="images/x2.gif" border="0" align="absmiddle" /></span></div>
   <div class="lavagna"><%=txtEvidenza%></div>
</div>
<!-- fine codice pop-up --><%

else
%>
</head>
<body  style="background-repeat: repeat-x; background-attachment: fixed;" topmargin="0" leftmargin="0" marginwidth="0" marginheight="0" ><%

end if
    %>

<!-- ******** FINE ***********************************************-->

<!-- old
</head>

<body>

fine old -->
<%
'**********************************************************************
' FUNZIONE PER L'INSERIMENTO DEI GIOCATORI DELLA PRECEDENTE FORMAZIONE
'**********************************************************************
Function InserisciGiocatore(posCampo, posArray, stato) ' stato = in campo o panchina

	if posArray < UBound(old) then

		dato = split(old(posArray), "-")
	
		set ls = new clsGiocatori
	
		ls.create
	
	    if ls.RichiamaGiocatori (Session("Stagione"), dato(0)) = 0 then
			if ls.Fantasquadra = Session("Access") then
				if stato = "in campo" then
                    'modificato 28.10
                    if esiste(ls.nome) then 
                        avatar = "images/giocatori/" & Replace(replace(replace(ls.nome, "'",""), " ", "-"), ".", "") & ".png"
                    else
                        avatar = "images/giocatori/no-image.png"
                    end if
					InserisciGiocatore=response.write("<td id='n" & posCampo & "'><img src='" & avatar & "' /> <br /><span style='background-color:#1f51a3;text-align:center;'>" & _
												ls.Nome & "</span></td>")
                    'InserisciGiocatore=response.write("<td style='color:white;' id='n" & posCampo & "'><img src='public/maglie/" & parMaglia & "' /> <br />" & _
					'							ls.Nome & "</td>")
                    ' fine modifica 28.10
				else
					if posCampo mod 2 = 0 then
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeleft'>" & ls.Nome & "</td>")
					else
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeright'>" & ls.Nome & "</td>")
					end if
				end if
			%>	
			<script type="text/javascript">
				formazione[<%=posArray%>]=String(<%=ls.Ruolo%>) + String(<%=ls.Codice%>);
				conto += 1;
		    </script>
			<%
    		else
				if stato = "in campo" then
					InserisciGiocatore = response.write("<td id='n" & posCampo & "'><img src='public/maglie/" & parMaglia & "' /> <br /></td>")
				else
					if posCampo mod 2 = 0 then
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeleft'></td>")
					else
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeright'></td>")
					end if
				end if
			end if
	
		else
			
			if stato = "in campo" then
					InserisciGiocatore = response.write("<td id='n" & posCampo & "'><img src='public/maglie/" & parMaglia & "' /> <br /></td>")
				else
					if posCampo mod 2 = 0 then
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeleft'></td>")
					else
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeright'></td>")
					end if
				end if
		
		end if
	
		set ls = nothing	
	
	else
	
		if stato = "in campo" then
					InserisciGiocatore = response.write("<td id='n" & posCampo & "'><img src='public/maglie/" & parMaglia & "' /> <br /></td>")
				else
					if posCampo mod 2 = 0 then
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeleft'></td>")
					else
						InserisciGiocatore=response.write("<td style='width:40%' id='n" & posCampo & "' class='nomeright'></td>")
					end if
				end if
	
	end if
		
end Function

if Session("Access") <> 0 then 
if parPage <> 0 and Not Session("Stop") then  %> 

 <div class="header-wrapper">
 &nbsp;
 <%
	set rsVer = dbconnection.execute("Select Versione From tblVersione WHERE Attuale")
	Versione = rsVer("Versione")
	set rsVer = nothing
 %>

 <div style="margin-top: 190px; margin-left: 930px;"><a href="default.asp?IDPage=5" style="color:#000099;text-decoration:none;"><%=Versione%></a></div>
 </div>

 
 <div class="navigator"><div>
 
  	<!-- #include file="menu/menu.asp" -->

 </div></div>
 
 
    	<%
		strSQL = "SELECT * FROM tblPage WHERE IDPage=" & parPage
		set rsPage = dbConnection.Execute(strSQL)
		parTipoPage = rsPage("Tipo")
		Select Case parTipoPage 
			case "hp"
			%>
    	<!-- #include file="layoutHP.asp" -->
    	<%
			Case "st"
				AggiornaST()
			case "sys"
			 Select case parPage 
							case 2 
								%>
								<!-- #include file="Moduli/SYS2.asp" -->
								<%'AggiornaSYS2()
							case 3
								%>
								<!-- #include file="Moduli/SYS3.asp" -->
								<%'AggiornaSYS3()
							case 4
								%>
								<!-- #include file="Moduli/SYS4.asp" -->
								<%'AggiornaSYS4()
							case 5
								%>
								<!-- #include file="Moduli/SYS5.asp" -->
                                <%
							case 6
								%>
								<!-- #include file="Moduli/SYS6.asp" -->
								<%'AggiornaSYS6()
							case 7
								%>
								<!-- #include file="Moduli/SYS7.asp" -->
								<%'AggiornaSYS7()
							case 8
								%>
								<!-- #include file="Moduli/SYS8.asp" -->
								<%'AggiornaSYS8()		
							case 9
								%>
								<!-- #include file="Moduli/SYS9.asp" -->
								<%'AggiornaSYS9()
							case 10
								%>
								<!-- #include file="Moduli/SYS10.asp" -->
								<%'AggiornaSYS10()
                            case 13
                                %>
								<!-- #include file="Moduli/SYS13.asp" -->
								<%
                            case 14
                                %>  
								<!-- #include file="Moduli/SYS14.asp" -->
								<%
                            case 15
                                %>  
								<!-- #include file="Moduli/SYS15.asp" -->
								<%
                             case 16
                                %>  
								<!-- #include file="Moduli/SYS16.asp" -->
								<%
                            case 17
                                %>  
								<!-- #include file="Moduli/SYS17.asp" -->
								<%
                            case 18
                                %>  
								<!-- #include file="Moduli/SYS18.asp" -->
								<%
						end select
		end select
		rsPage.close
		set rsPage = nothing
		%>
  
<div class="footer">

   	<div class="foot_nav">
		<div class="nav_section">
			<!--<h4>Sezione in allestimento</h4>-->
        </div>
		<!--		<ul>
				    <li><a title="Pubblicit&agrave; Fantagazzetta" href="http://www.fantagazzetta.com/area/pubblicit&agrave;/11">Pubblicit&agrave;</a></li>
    				<li><a title="Contatti Fantagazzetta" href="http://www.fantagazzetta.com/contattaci">Contatti</a></li>
				    <li><a title="Redazione Fantagazzetta" href="http://www.fantagazzetta.com/area/redazione-sito/9">Redazione</a></li>

				    <li><a title="Termini e condizioni di utlizzo" href="http://www.fantagazzetta.com/area/termini-e-condizioni/12">Termini e Condizioni</a></li>
				    <li><a title="Informativa sulla privacy" href="http://www.fantagazzetta.com/area/privacy/13">Privacy</a></li>
				</ul>
		</div>
	
    	<div class="nav_section">
			<h4>Siti Network</h4>
			<ul>
			    <li><a title="Canale Juve" target="_blank" href="http://www.canalejuve.it">Canale Juve</a></li>
			    <li><a title="Canale Milan" target="_blank" href="http://www.canalemilan.it">Canale Milan</a></li>

		    	<li><a title="Canale Inter" target="_blank" href="http://www.canaleinter.it">Canale Inter</a></li>
			    <li><a title="Campioncini serie a" target="_blank" href="http://www.icampioncini.it">ICampioncini</a></li>
			</ul>
		</div>
	
    	<div class="nav_section">
			<h4>Giochi</h4>
			<ul>
		    	<li><a title="Fantagenius" target="_blank" href="http://www.fantagenius.com">FantaGenius</a></li>
		    	<li><a title="Gestione Leghe" target="_blank" href="http://leghe.fantagazzetta.com">Gestione Leghe</a></li>

			    <li><a title="Golandwin" target="_blank" href="http://www.golandwin.it">Gol And Win</a></li>
			</ul>
		</div>

	</div>-->

	<div class="join">
		<h4>Siti Amici</h4>
		<p>
        	<a target="_blank" tutle="Fantagazzetta" href="http://www.fantagazzetta.com">Fantagazzetta</a>&nbsp;-&nbsp;<a target="_blank" title="Rebel Dragon" href="http://www.rebeldragon.it">Rebel Dragon</a>&nbsp;-&nbsp;</p>
	</div>

	<p class="copy">
		Quelli del Mercoledì - Graficamente ispirato al sito della Fantagazzetta 
    </p>

</div>
 
<% else %>
  	<div style="font-family:Verdana, Arial, Helvetica, sans-serif; font-size:24px; color:#ea9816; margin: 40px; ">
		Sito in aggiornamento <br />
        Riprovare più tardi
	</div>
<% end if 
else Response.Redirect("login.asp")
end if
%> 
 
</body></html>